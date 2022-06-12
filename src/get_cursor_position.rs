use device_query::{DeviceQuery, DeviceState};

pub fn get_cursor_position() -> (i32, i32) {
  let device_state = DeviceState::new();
  let mouse = device_state.get_mouse();
  mouse.coords
}