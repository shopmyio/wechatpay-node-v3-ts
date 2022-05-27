'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var crypto_1 = __importDefault(require("crypto"));
var superagent_1 = __importDefault(require("superagent"));
var x509_1 = require('@fidm/x509');
var Pay = /** @class */ (function () {
    function Pay(arg1, mchid, publicKey, privateKey, optipns) {
        this.serial_no = ''; // 证书序列号
        this.authType = 'WECHATPAY2-SHA256-RSA2048'; // 认证类型，目前为WECHATPAY2-SHA256-RSA2048
        this.userAgent = '127.0.0.1'; // User-Agent
        if (arg1 instanceof Object) {
            this.appid = arg1.appid;
            this.mchid = arg1.mchid;
            if (arg1.serial_no)
                this.serial_no = arg1.serial_no;
            this.publicKey = arg1.publicKey;
            if (!this.publicKey)
                throw new Error('缺少公钥');
            this.privateKey = arg1.privateKey;
            if (!arg1.serial_no)
                this.serial_no = this.getSN(this.publicKey);
            this.authType = arg1.authType || 'WECHATPAY2-SHA256-RSA2048';
            this.userAgent = arg1.userAgent || '127.0.0.1';
            this.key = arg1.key;
        }
        else {
            var _optipns = optipns || {};
            this.appid = arg1;
            this.mchid = mchid || '';
            this.publicKey = publicKey;
            this.privateKey = privateKey;
            this.sp_appid = _optipns.sp_appid || '';
            this.sp_mchid = _optipns.sp_mchid || '';
            this.notify_url = _optipns.notify_url || '';
            this.authType = _optipns.authType || 'WECHATPAY2-SHA256-RSA2048';
            this.userAgent = _optipns.userAgent || '127.0.0.1';
            this.key = _optipns.key;
            this.serial_no = _optipns.serial_no || '';
            if (!this.publicKey)
                throw new Error('缺少公钥');
            if (!this.serial_no)
                this.serial_no = this.getSN(this.publicKey);
        }
    }
    /**
     * 拉取平台证书到 Pay.certificates 中
     * @param apiSecret APIv3密钥
     */
    Pay.prototype.fetchCertificates = function (apiSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var url, authorization, result, data, newCertificates_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.mch.weixin.qq.com/v3/certificates';
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200) {
                            data = result.data;
                            newCertificates_1 = {};
                            data.forEach(function (item) {
                                var decryptCertificate = _this.decipher_gcm(item.encrypt_certificate.ciphertext, item.encrypt_certificate.associated_data, item.encrypt_certificate.nonce, apiSecret);
                                newCertificates_1[item.serial_no] = x509_1.Certificate.fromPEM(Buffer.from(decryptCertificate)).publicKey.toPEM();
                            });
                            Pay.certificates = __assign(__assign({}, Pay.certificates), newCertificates_1);
                        }
                        else {
                            throw new Error('拉取平台证书失败');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 验证签名，提醒：node 取头部信息时需要用小写，例如：req.headers['wechatpay-timestamp']
     * @param params.timestamp HTTP头Wechatpay-Timestamp 中的应答时间戳
     * @param params.nonce HTTP头Wechatpay-Nonce 中的应答随机串
     * @param params.body 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败。
     * @param params.serial HTTP头Wechatpay-Serial 证书序列号
     * @param params.signature HTTP头Wechatpay-Signature 签名
     * @param params.apiSecret APIv3密钥，如果在 构造器 中有初始化该值(this.key)，则可以不传入。当然传入也可以
     */
    Pay.prototype.verifySign = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, nonce, body, serial, signature, apiSecret, publicKey, bodyStr, data, verify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = params.timestamp, nonce = params.nonce, body = params.body, serial = params.serial, signature = params.signature, apiSecret = params.apiSecret;
                        publicKey = Pay.certificates[serial];
                        if (!!publicKey) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchCertificates(apiSecret)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        publicKey = Pay.certificates[serial];
                        if (!publicKey) {
                            throw new Error('平台证书序列号不相符，未找到平台序列号');
                        }
                        bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
                        data = "".concat(timestamp, "\n").concat(nonce, "\n").concat(bodyStr, "\n");
                        verify = crypto_1.default.createVerify('RSA-SHA256');
                        verify.update(data);
                        return [2 /*return*/, verify.verify(publicKey, signature, 'base64')];
                }
            });
        });
    };
    /**
     * 构建请求签名参数
     * @param method Http 请求方式
     * @param url 请求接口 例如/v3/certificates
     * @param timestamp 获取发起请求时的系统当前时间戳
     * @param nonceStr 随机字符串
     * @param body 请求报文主体
     */
    Pay.prototype.getSignature = function (method, nonce_str, timestamp, url, body) {
        var str = method + '\n' + url + '\n' + timestamp + '\n' + nonce_str + '\n';
        if (body && body instanceof Object)
            body = JSON.stringify(body);
        if (body)
            str = str + body + '\n';
        if (method === 'GET')
            str = str + '\n';
        return this.sha256WithRsa(str);
    };
    // jsapi 和 app 支付参数签名 加密自动顺序如下 不能错乱
    // 应用id
    // 时间戳
    // 随机字符串
    // 预支付交易会话ID
    Pay.prototype.sign = function (str) {
        // let str = '';
        // const exclude = ['signType', 'paySign', 'status', 'package', 'partnerid'];
        // for (const key in params) {
        //   if (!exclude.includes(key)) {
        //     str = str + params[key] + '\n';
        //   }
        // }
        return this.sha256WithRsa(str);
    };
    // 获取序列号
    Pay.prototype.getSN = function (fileData) {
        if (!fileData && !this.publicKey)
            throw new Error('缺少公钥');
        if (!fileData)
            fileData = this.publicKey;
        if (typeof fileData == 'string') {
            fileData = Buffer.from(fileData);
        }
        var certificate = x509_1.Certificate.fromPEM(fileData);
        return certificate.serialNumber;
    };
    /**
     * SHA256withRSA
     * @param data 待加密字符
     * @param privatekey 私钥key  key.pem   fs.readFileSync(keyPath)
     */
    Pay.prototype.sha256WithRsa = function (data) {
        if (!this.privateKey)
            throw new Error('缺少秘钥文件');
        return crypto_1.default
            .createSign('RSA-SHA256')
            .update(data)
            .sign(this.privateKey, 'base64');
    };
    /**
     * 获取授权认证信息
     * @param nonceStr  请求随机串
     * @param timestamp 时间戳
     * @param signature 签名值
     */
    Pay.prototype.getAuthorization = function (nonce_str, timestamp, signature) {
        var _authorization = 'mchid="' +
            this.mchid +
            '",' +
            'nonce_str="' +
            nonce_str +
            '",' +
            'timestamp="' +
            timestamp +
            '",' +
            'serial_no="' +
            this.serial_no +
            '",' +
            'signature="' +
            signature +
            '"';
        return this.authType.concat(' ').concat(_authorization);
    };
    /**
     * 回调解密
     * @param ciphertext  Base64编码后的开启/停用结果数据密文
     * @param associated_data 附加数据
     * @param nonce 加密使用的随机串
     * @param key  APIv3密钥
     */
    Pay.prototype.decipher_gcm = function (ciphertext, associated_data, nonce, key) {
        if (key)
            this.key = key;
        if (!this.key)
            throw new Error('缺少key');
        var _ciphertext = Buffer.from(ciphertext, 'base64');
        // 解密 ciphertext字符  AEAD_AES_256_GCM算法
        var authTag = _ciphertext.slice(_ciphertext.length - 16);
        var data = _ciphertext.slice(0, _ciphertext.length - 16);
        var decipher = crypto_1.default.createDecipheriv('aes-256-gcm', this.key, nonce);
        decipher.setAuthTag(authTag);
        decipher.setAAD(Buffer.from(associated_data));
        var decoded = decipher.update(data, undefined, 'utf8');
        decipher.final();
        try {
            return JSON.parse(decoded);
        }
        catch (e) {
            return decoded;
        }
    };
    /**
     * 参数初始化
     */
    Pay.prototype.init = function (method, url, params) {
        var nonce_str = Math.random()
            .toString(36)
            .substr(2, 15), timestamp = parseInt(+new Date() / 1000 + '').toString();
        var signature = this.getSignature(method, nonce_str, timestamp, url.replace('https://api.mch.weixin.qq.com', ''), params);
        var authorization = this.getAuthorization(nonce_str, timestamp, signature);
        return authorization;
    };
    /**
     * post 请求
     * @param url  请求接口
     * @param params 请求参数
     */
    Pay.prototype.postRequest = function (url, params, authorization) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, superagent_1.default
                                .post(url)
                                .send(params)
                                .set({
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'User-Agent': this.userAgent,
                                Authorization: authorization,
                                'Accept-Encoding': 'gzip',
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, __assign({ status: result.status }, result.body)];
                    case 2:
                        error_1 = _a.sent();
                        err = JSON.parse(JSON.stringify(error_1));
                        return [2 /*return*/, __assign({ status: err.status }, (err.response.text && JSON.parse(err.response.text)))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get 请求
     * @param url  请求接口
     * @param params 请求参数
     */
    Pay.prototype.getRequest = function (url, authorization) {
        return __awaiter(this, void 0, void 0, function () {
            var result, data, error_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, superagent_1.default.get(url).set({
                                Accept: 'application/json',
                                'User-Agent': this.userAgent,
                                Authorization: authorization,
                            })];
                    case 1:
                        result = _a.sent();
                        data = {};
                        switch (result.type) {
                            case 'application/json':
                                data = __assign({ status: result.status }, result.body);
                                break;
                            case 'text/plain':
                                data = {
                                    status: result.status,
                                    data: result.text,
                                };
                                break;
                            case 'application/x-gzip':
                                data = {
                                    status: result.status,
                                    data: result.body,
                                };
                                break;
                            default:
                                data = __assign({ status: result.status }, result.body);
                        }
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        err = JSON.parse(JSON.stringify(error_2));
                        return [2 /*return*/, __assign({ status: err.status }, (err.response.text && JSON.parse(err.response.text)))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ---------------支付相关接口--------------//
    /**
     * h5支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_1.shtml
     */
    Pay.prototype.transactions_h5 = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ appid: this.appid, mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/h5';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 合单h5支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_2.shtml
     */
    Pay.prototype.combine_transactions_h5 = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ combine_appid: this.appid, combine_mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/combine-transactions/h5';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * native支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml
     */
    Pay.prototype.transactions_native = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ appid: this.appid, mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/native';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 合单native支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_5.shtml
     */
    Pay.prototype.combine_transactions_native = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ combine_appid: this.appid, combine_mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/combine-transactions/native';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * app支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_1.shtml
     */
    Pay.prototype.transactions_app = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization, result, data, str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ appid: this.appid, mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/app';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200 && result.prepay_id) {
                            data = {
                                status: result.status,
                                appid: this.appid,
                                partnerid: this.mchid,
                                package: 'Sign=WXPay',
                                timestamp: parseInt(+new Date() / 1000 + '').toString(),
                                noncestr: Math.random()
                                    .toString(36)
                                    .substr(2, 15),
                                prepayid: result.prepay_id,
                                sign: '',
                            };
                            str = [data.appid, data.timestamp, data.noncestr, data.package, ''].join('\n');
                            data.sign = this.sign(str);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 合单app支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_1.shtml
     */
    Pay.prototype.combine_transactions_app = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization, result, data, str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ combine_appid: this.appid, combine_mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/combine-transactions/app';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200 && result.prepay_id) {
                            data = {
                                status: result.status,
                                appid: this.appid,
                                partnerid: this.mchid,
                                package: 'Sign=WXPay',
                                timestamp: parseInt(+new Date() / 1000 + '').toString(),
                                noncestr: Math.random()
                                    .toString(36)
                                    .substr(2, 15),
                                prepayid: result.prepay_id,
                                sign: '',
                            };
                            str = [data.appid, data.timestamp, data.noncestr, data.prepayid, ''].join('\n');
                            data.sign = this.sign(str);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * JSAPI支付 或者 小程序支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
     */
    Pay.prototype.transactions_jsapi = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization, result, data, str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ appid: this.appid, mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200 && result.prepay_id) {
                            data = {
                                status: result.status,
                                appId: this.appid,
                                timeStamp: parseInt(+new Date() / 1000 + '').toString(),
                                nonceStr: Math.random()
                                    .toString(36)
                                    .substr(2, 15),
                                package: "prepay_id=".concat(result.prepay_id),
                                signType: 'RSA',
                                paySign: '',
                            };
                            str = [data.appId, data.timeStamp, data.nonceStr, data.package, ''].join('\n');
                            data.paySign = this.sign(str);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 服务商逻辑
     * https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter4_1_1.shtml
     */
    Pay.prototype.transactions_jsapi_sp = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization, result, data, str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ sp_appid: this.sp_appid, sp_mchid: this.sp_mchid, sub_appid: this.appid, sub_mchid: this.mchid, notify_url: this.notify_url }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/jsapi';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200 && result.prepay_id) {
                            data = {
                                status: result.status,
                                appId: this.appid,
                                timeStamp: parseInt(+new Date() / 1000 + '').toString(),
                                nonceStr: Math.random()
                                    .toString(36)
                                    .substr(2, 15),
                                package: "prepay_id=".concat(result.prepay_id),
                                signType: 'RSA',
                                paySign: '',
                            };
                            str = [data.appId, data.timeStamp, data.nonceStr, data.package, ''].join('\n');
                            data.paySign = this.sign(str);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 合单JSAPI支付 或者 小程序支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_3.shtml
     */
    Pay.prototype.combine_transactions_jsapi = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization, result, data, str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _params = __assign({ combine_appid: this.appid, combine_mchid: this.mchid }, params);
                        url = 'https://api.mch.weixin.qq.com/v3/combine-transactions/jsapi';
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1:
                        result = _a.sent();
                        if (result.status === 200 && result.prepay_id) {
                            data = {
                                status: result.status,
                                appId: this.appid,
                                timeStamp: parseInt(+new Date() / 1000 + '').toString(),
                                nonceStr: Math.random()
                                    .toString(36)
                                    .substr(2, 15),
                                package: "prepay_id=".concat(result.prepay_id),
                                signType: 'RSA',
                                paySign: '',
                            };
                            str = [data.appId, data.timeStamp, data.nonceStr, data.package, ''].join('\n');
                            data.paySign = this.sign(str);
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * 查询订单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_2.shtml
     */
    Pay.prototype.query = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '';
                        if (params.transaction_id) {
                            url = "https://api.mch.weixin.qq.com/v3/pay/transactions/id/".concat(params.transaction_id, "?mchid=").concat(this.mchid);
                        }
                        else if (params.out_trade_no) {
                            url = "https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/".concat(params.out_trade_no, "?mchid=").concat(this.mchid);
                        }
                        else {
                            throw new Error('缺少transaction_id或者out_trade_no');
                        }
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 合单查询订单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_11.shtml
     */
    Pay.prototype.combine_query = function (combine_out_trade_no) {
        return __awaiter(this, void 0, void 0, function () {
            var url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!combine_out_trade_no)
                            throw new Error('缺少combine_out_trade_no');
                        url = "https://api.mch.weixin.qq.com/v3/combine-transactions/out-trade-no/".concat(combine_out_trade_no);
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 关闭订单
     * @param out_trade_no 请求参数 商户订单号 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_3.shtml
     */
    Pay.prototype.close = function (out_trade_no) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!out_trade_no)
                            throw new Error('缺少out_trade_no');
                        _params = {
                            mchid: this.mchid,
                        };
                        url = "https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/".concat(out_trade_no, "/close");
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 合单关闭订单
     * @param combine_out_trade_no 请求参数 总订单号 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_12.shtml
     * @param sub_orders array 子单信息
     */
    Pay.prototype.combine_close = function (combine_out_trade_no, sub_orders) {
        return __awaiter(this, void 0, void 0, function () {
            var _params, url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!combine_out_trade_no)
                            throw new Error('缺少out_trade_no');
                        _params = {
                            combine_appid: this.appid,
                            sub_orders: sub_orders,
                        };
                        url = "https://api.mch.weixin.qq.com/v3/combine-transactions/out-trade-no/".concat(combine_out_trade_no, "/close");
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 申请交易账单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_6.shtml
     */
    Pay.prototype.tradebill = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _params, querystring, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.mch.weixin.qq.com/v3/bill/tradebill';
                        _params = __assign({}, params);
                        querystring = Object.keys(_params)
                            .filter(function (key) {
                            return !!_params[key];
                        })
                            .sort()
                            .map(function (key) {
                            return key + '=' + _params[key];
                        })
                            .join('&');
                        url = url + "?".concat(querystring);
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 申请资金账单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_7.shtml
     */
    Pay.prototype.fundflowbill = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _params, querystring, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.mch.weixin.qq.com/v3/bill/fundflowbill';
                        _params = __assign({}, params);
                        querystring = Object.keys(_params)
                            .filter(function (key) {
                            return !!_params[key];
                        })
                            .sort()
                            .map(function (key) {
                            return key + '=' + _params[key];
                        })
                            .join('&');
                        url = url + "?".concat(querystring);
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 下载账单
     * @param download_url 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_8.shtml
     */
    Pay.prototype.downloadbill = function (download_url) {
        return __awaiter(this, void 0, void 0, function () {
            var authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authorization = this.init('GET', download_url);
                        return [4 /*yield*/, this.getRequest(download_url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 申请退款
     * @param 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_9.shtml
     */
    Pay.prototype.refunds = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _params, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds';
                        _params = __assign({}, params);
                        authorization = this.init('POST', url, _params);
                        return [4 /*yield*/, this.postRequest(url, _params, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 查询单笔退款
     * @param 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_10.shtml
     */
    Pay.prototype.find_refunds = function (out_refund_no) {
        return __awaiter(this, void 0, void 0, function () {
            var url, authorization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!out_refund_no)
                            throw new Error('缺少out_refund_no');
                        url = "https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/".concat(out_refund_no);
                        authorization = this.init('GET', url);
                        return [4 /*yield*/, this.getRequest(url, authorization)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Pay.certificates = {}; // 商户平台证书 key 是 serialNo, value 是 publicKey
    return Pay;
}());
module.exports = Pay;
