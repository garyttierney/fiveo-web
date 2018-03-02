extern crate fiveo;

use std::ffi;
use std::mem;
use std::slice;
use std::ptr;
use std::os::raw::c_char;
use std::os::raw::c_int;
use std::os::raw::c_float;

#[no_mangle]
pub extern "C" fn matcher_create(input: *mut u8, input_length: usize) -> *mut fiveo::Matcher {
    let result = unsafe {
        let input = slice::from_raw_parts(input as *const u8, input_length);
        fiveo::Matcher::new(input)
    };

    match result {
        Ok(matcher) => Box::into_raw(Box::new(matcher)),
        Err(_) => ptr::null_mut(),
    }
}

#[no_mangle]
pub extern "C" fn matcher_search(matcher: *mut fiveo::Matcher, query: &str) {
    let matcher_ref = unsafe { &*matcher };
    let search = matcher_ref.search(query);

    for result in search {
        unsafe {
            handle_search_result(
                ffi::CString::new("test").unwrap().as_ptr(),
                ffi::CString::new(result.value()).unwrap().as_ptr(),
                result.score(),
            );
        }
    }
}

extern "C" {
    pub fn handle_search_result(
        token: *const c_char,
        value: *const c_char,
        score: c_float,
    ) -> c_int;
}
