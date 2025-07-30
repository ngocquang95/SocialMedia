// Import all songs
import { anhThoiNhanNhuong } from './anh_thoi_nhan_nhuong.js';
import { anhVui } from './anh_vui.js';
import { hayHatLen } from './hay_hat_len.js';

// Export all songs as an array
export const songs = [
    anhThoiNhanNhuong,
    anhVui,
    hayHatLen
];

// Export individual songs
export { anhThoiNhanNhuong, anhVui, hayHatLen }; 