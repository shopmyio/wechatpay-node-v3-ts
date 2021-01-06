// 订单金额信息
interface Iamount {
  total: number;
  currency?: string;
}
// 优惠功能
interface Idetail {
  cost_price?: number;
  invoice_id?: string;
  goods_detail?: IgoodsDetail[];
}
// 单品列表信息
interface IgoodsDetail {
  merchant_goods_id: string;
  wechatpay_goods_id?: string;
  goods_name?: string;
  quantity: number;
  unit_price: number;
}
// 支付场景描述
interface IsceneInfoH5 {
  payer_client_ip: string;
  device_id?: string;
  store_info?: IstoreInfo;
  h5_info: Ih5Info;
}
// 商户门店信息
interface IstoreInfo {
  id: string;
  name?: string;
  area_code?: string;
  address?: string;
}
// H5场景信息
interface Ih5Info {
  type: string;
  app_name: string;
  app_url?: string;
  bundle_id?: string;
  package_name?: string;
}

// 抛出
export interface Ipay {
  appid: string; //  直连商户申请的公众号或移动应用appid。
  mchid: string; // 商户号
  serial_no: string; // 证书序列号
  publicKey: Buffer; // 公钥
  privateKey: Buffer; // 密钥
  authType?: string; // 认证类型，目前为WECHATPAY2-SHA256-RSA2048
}
export interface Ih5 {
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  amount: Iamount;
  detail?: Idetail;
  scene_info: IsceneInfoH5;
}