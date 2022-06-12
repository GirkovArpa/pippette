use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Gdi::{GetDC, GetPixel, ReleaseDC};

pub fn get_pixel_color(x: i32, y: i32) -> u32 {
    let hwnd = unsafe { HWND::default() };
    let hdc = unsafe { GetDC(hwnd) };
    let pxl = unsafe { GetPixel(hdc, x, y) };
    unsafe { ReleaseDC(hwnd, hdc) };
    pxl
}