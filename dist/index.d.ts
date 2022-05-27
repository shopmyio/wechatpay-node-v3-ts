/// <reference types="node" />
import { Ipay, Ih5, Inative, Ijsapi, Iquery1, Iquery2, Itradebill, Ifundflowbill, Iapp, Ioptions, Irefunds1, Irefunds2 } from './lib/interface';
import { IcombineH5, IcombineNative, IcombineApp, IcombineJsapi, IcloseSubOrders } from './lib/combine_interface';
declare class Pay {
    private appid;
    private mchid;
    private sp_appid?;
    private sp_mchid?;
    private notify_url?;
    private serial_no;
    private publicKey?;
    private privateKey?;
    private authType;
    private userAgent;
    private key?;
    private static certificates;
    /**
     * 构造器
     * @param appid 直连商户申请的公众号或移动应用appid。
     * @param mchid 商户号
     * @param publicKey 公钥
     * @param privateKey 密钥
     * @param optipns 可选参数 object 包括下面参数
     *
     * @param serial_no  证书序列号
     * @param authType 可选参数 认证类型，目前为WECHATPAY2-SHA256-RSA2048
     * @param userAgent 可选参数 User-Agent
     * @param key 可选参数 APIv3密钥
     */
    constructor(appid: string, mchid: string, publicKey: Buffer, privateKey: Buffer, optipns?: Ioptions);
    /**
     * 构造器
     * @param obj object类型 包括下面参数
     *
     * @param appid 直连商户申请的公众号或移动应用appid。
     * @param mchid 商户号
     * @param serial_no  可选参数 证书序列号
     * @param publicKey 公钥
     * @param privateKey 密钥
     * @param authType 可选参数 认证类型，目前为WECHATPAY2-SHA256-RSA2048
     * @param userAgent 可选参数 User-Agent
     * @param key 可选参数 APIv3密钥
     */
    constructor(obj: Ipay);
    /**
     * 拉取平台证书到 Pay.certificates 中
     * @param apiSecret APIv3密钥
     */
    private fetchCertificates;
    /**
     * 验证签名，提醒：node 取头部信息时需要用小写，例如：req.headers['wechatpay-timestamp']
     * @param params.timestamp HTTP头Wechatpay-Timestamp 中的应答时间戳
     * @param params.nonce HTTP头Wechatpay-Nonce 中的应答随机串
     * @param params.body 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败。
     * @param params.serial HTTP头Wechatpay-Serial 证书序列号
     * @param params.signature HTTP头Wechatpay-Signature 签名
     * @param params.apiSecret APIv3密钥，如果在 构造器 中有初始化该值(this.key)，则可以不传入。当然传入也可以
     */
    verifySign(params: {
        timestamp: string | number;
        nonce: string;
        body: Record<string, any> | string;
        serial: string;
        signature: string;
        apiSecret?: string;
    }): Promise<boolean>;
    /**
     * 构建请求签名参数
     * @param method Http 请求方式
     * @param url 请求接口 例如/v3/certificates
     * @param timestamp 获取发起请求时的系统当前时间戳
     * @param nonceStr 随机字符串
     * @param body 请求报文主体
     */
    getSignature(method: string, nonce_str: string, timestamp: string, url: string, body?: string | Record<string, any>): string;
    private sign;
    getSN(fileData?: string | Buffer): string;
    /**
     * SHA256withRSA
     * @param data 待加密字符
     * @param privatekey 私钥key  key.pem   fs.readFileSync(keyPath)
     */
    sha256WithRsa(data: string): string;
    /**
     * 获取授权认证信息
     * @param nonceStr  请求随机串
     * @param timestamp 时间戳
     * @param signature 签名值
     */
    getAuthorization(nonce_str: string, timestamp: string, signature: string): string;
    /**
     * 回调解密
     * @param ciphertext  Base64编码后的开启/停用结果数据密文
     * @param associated_data 附加数据
     * @param nonce 加密使用的随机串
     * @param key  APIv3密钥
     */
    decipher_gcm<T extends any>(ciphertext: string, associated_data: string, nonce: string, key?: string): T;
    /**
     * 参数初始化
     */
    private init;
    /**
     * post 请求
     * @param url  请求接口
     * @param params 请求参数
     */
    private postRequest;
    /**
     * get 请求
     * @param url  请求接口
     * @param params 请求参数
     */
    private getRequest;
    /**
     * h5支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_1.shtml
     */
    transactions_h5(params: Ih5): Promise<Record<string, any>>;
    /**
     * 合单h5支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_2.shtml
     */
    combine_transactions_h5(params: IcombineH5): Promise<Record<string, any>>;
    /**
     * native支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml
     */
    transactions_native(params: Inative): Promise<Record<string, any>>;
    /**
     * 合单native支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_5.shtml
     */
    combine_transactions_native(params: IcombineNative): Promise<Record<string, any>>;
    /**
     * app支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_1.shtml
     */
    transactions_app(params: Iapp): Promise<Record<string, any>>;
    /**
     * 合单app支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_1.shtml
     */
    combine_transactions_app(params: IcombineApp): Promise<Record<string, any>>;
    /**
     * JSAPI支付 或者 小程序支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
     */
    transactions_jsapi(params: Ijsapi): Promise<Record<string, any>>;
    /**
     * 服务商逻辑
     * https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter4_1_1.shtml
     */
    transactions_jsapi_sp(params: Ijsapi): Promise<Record<string, any>>;
    /**
     * 合单JSAPI支付 或者 小程序支付
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_3.shtml
     */
    combine_transactions_jsapi(params: IcombineJsapi): Promise<Record<string, any>>;
    /**
     * 查询订单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_2.shtml
     */
    query(params: Iquery1 | Iquery2): Promise<Record<string, any>>;
    /**
     * 合单查询订单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_11.shtml
     */
    combine_query(combine_out_trade_no: string): Promise<Record<string, any>>;
    /**
     * 关闭订单
     * @param out_trade_no 请求参数 商户订单号 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_3_3.shtml
     */
    close(out_trade_no: string): Promise<Record<string, any>>;
    /**
     * 合单关闭订单
     * @param combine_out_trade_no 请求参数 总订单号 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter5_1_12.shtml
     * @param sub_orders array 子单信息
     */
    combine_close(combine_out_trade_no: string, sub_orders: IcloseSubOrders[]): Promise<Record<string, any>>;
    /**
     * 申请交易账单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_6.shtml
     */
    tradebill(params: Itradebill): Promise<Record<string, any>>;
    /**
     * 申请资金账单
     * @param params 请求参数 object 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_7.shtml
     */
    fundflowbill(params: Ifundflowbill): Promise<Record<string, any>>;
    /**
     * 下载账单
     * @param download_url 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_8.shtml
     */
    downloadbill(download_url: string): Promise<Record<string, any>>;
    /**
     * 申请退款
     * @param 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_9.shtml
     */
    refunds(params: Irefunds1 | Irefunds2): Promise<Record<string, any>>;
    /**
     * 查询单笔退款
     * @param 请求参数 路径 参数介绍 请看文档https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_2_10.shtml
     */
    find_refunds(out_refund_no: string): Promise<Record<string, any>>;
}
export = Pay;
