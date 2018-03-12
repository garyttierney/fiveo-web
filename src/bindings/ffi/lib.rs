// We aren't using the standard library.
#![no_std]
// Required to replace the global allocator.
#![feature(global_allocator)]
// Required to use the `alloc` crate and its types, the `abort` intrinsic, and a
// custom panic handler.
#![feature(alloc, core_intrinsics, lang_items)]

extern crate alloc;
extern crate fiveo;
extern crate rlibc;
extern crate wee_alloc;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Need to provide a tiny `panic_fmt` lang-item implementation for `#![no_std]`.
// This implementation will translate panics into traps in the resulting
// WebAssembly.
#[lang = "panic_fmt"]
#[no_mangle]
pub extern "C" fn panic_fmt(_args: ::core::fmt::Arguments, _file: &'static str, _line: u32) -> ! {
    use core::intrinsics;
    unsafe {
        intrinsics::abort();
    }
}

use alloc::boxed::Box;
use alloc::Vec;

use core::mem;
use core::ptr;
use core::slice;
use core::str;

static mut LAST_ERROR: Option<u32> = None;

fn err_code(error: fiveo::MatcherError) -> u32 {
    match error {
        fiveo::MatcherError::TextEncoding(..) => 1,
    }
}

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut isize {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);

    ptr as *mut isize
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut isize, cap: usize) {
    unsafe {
        let _buf = Vec::from_raw_parts(ptr, 0, cap);
    }
}

#[no_mangle]
pub extern "C" fn fiveo_last_error() -> u32 {
    unsafe {
        match LAST_ERROR {
            None => 0,
            Some(e) => e as u32,
        }
    }
}

#[no_mangle]
pub extern "C" fn fiveo_matcher_create<'a>(
    dictionary: *const u8,
    dictionary_len: usize,
) -> *mut fiveo::Matcher<'a> {
    let input_slice = unsafe { slice::from_raw_parts(dictionary, dictionary_len) };

    str::from_utf8(input_slice)
        .map_err(|err| fiveo::MatcherError::TextEncoding(err))
        .and_then(|val| fiveo::Matcher::new(val, fiveo::MatcherParameters::default()))
        .map(|matcher| Box::into_raw(Box::new(matcher)))
        .unwrap_or_else(|err| {
            unsafe {
                LAST_ERROR = Some(err_code(err));
            };

            ptr::null_mut()
        })
}

#[no_mangle]
pub extern "C" fn fiveo_matcher_search(
    matcher: *mut fiveo::Matcher,
    query_token: u32,
    query: *const u8,
    query_len: usize,
    max_results: usize,
) -> u32 {
    let (matcher, query_slice) = unsafe {
        let query_slice = slice::from_raw_parts(query, query_len);
        let matcher = &*matcher;

        (matcher, query_slice)
    };

    let search = str::from_utf8(query_slice)
        .map_err(|err| fiveo::MatcherError::TextEncoding(err))
        .map(|query| matcher.search(query, max_results));

    match search {
        Ok(results) => for result in results {
            unsafe {
                handle_search_result(query_token as u32, result.index() as u32, result.score());
            }
        },
        Err(err) => return err_code(err),
    }

    0
}

extern "C" {
    pub fn handle_search_result(token: u32, index: u32, score: f32) -> i32;
}
