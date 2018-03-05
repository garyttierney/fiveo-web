extern crate fiveo;

use std::mem;
use std::ptr;
use std::os::raw::c_uchar;
use std::os::raw::c_int;
use std::os::raw::c_uint;
use std::os::raw::c_float;
use std::os::raw::c_void;
use std::slice;
use std::str;

static mut LAST_ERROR: Option<u32> = None;

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);

    ptr as *mut c_void
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut c_void, cap: usize) {
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
pub extern "C" fn fiveo_matcher_create(
    dictionary: *const u8,
    dictionary_len: usize,
) -> *mut fiveo::Matcher {
    let input_slice = unsafe { slice::from_raw_parts(dictionary, dictionary_len) };

    str::from_utf8(input_slice)
        .map_err(|err| fiveo::MatcherError::TextEncoding(err))
        .and_then(|val| fiveo::Matcher::new(val))
        .map(|matcher| Box::into_raw(Box::new(matcher)))
        .unwrap_or_else(|err| {
            let error_code = std::convert::From::from(err);
            unsafe {
                LAST_ERROR = Some(error_code);
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
) -> c_uint {
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
                handle_search_result(
                    query_token as u32,
                    result.index() as u32,
                    result.score(),
                );
            }
        },
        Err(err) => return std::convert::From::from(err)
    }

    0
}

extern "C" {
    pub fn handle_search_result(
        token: c_uint,
        index: c_uint,
        score: c_float,
    ) -> c_int;
}
