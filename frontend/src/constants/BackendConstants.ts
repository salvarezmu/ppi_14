export enum BackendConstants {
    VALIDATE_ADDRESS = 'api/v1/tronapi/validate-address/',
    GET_BLOCK_HISTORY = 'api/v1/tronapi/block/get-history/',
    GET_TRX_BALANCE = 'api/v1/tronapi/trx/get-balance/',
    GET_TRX_TRANSACTIONS = 'api/v1/tronapi/trx/get-transactions/',
    GET_BLOCK_TRANSACTIONS = 'api/v1/tronapi/block/get-transactions/',
    LOGIN = 'api/v1/users/login/',
    REGISTER = 'api/v1/users/register/',
    DELETE_ACCOUNT = '/api/v1/users/delete-account',
    GET_ALL_CONTRACTS = '/api/v1/contract/get-all',
    SAVE_CONTRACT = '/api/v1/contract/save',
    GET_ALL_CATEGORIES = '/api/v1/category/get-all',
    GENERATE_QR = '/api/v1/tronapi/generate-qr/',
    UPDATE_USER = '/api/v1/users/update-account/',
    UPDATE_PASSWORD = '/api/v1/users/update-password/',
    CATEGORIZE_TRANSACTION = '/api/v1/category/categorize'
}