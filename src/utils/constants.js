// Những domain được phép truy cập vào tài nguyên Server
export const WHITELIST_DOMAINS = [
    'http://localhost:5173',
    // sau này deploy lên server thì thêm domain của server vào đây
]
export const BOARD_TYPE = {
    PUBLIC: 'public',
    PRIVATE: 'private',
}