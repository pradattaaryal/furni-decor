import AppConfig from './app.config';
import HelperConfig from './helper.config';
import RequestConfig from './request.config';
import DataBaseConfig from './database.config';
import MailConfig from './mail.config';
import AuthConfig from './auth.config';
import FileConfig from './file.config';
import StripeConfig from './stripe.config'
import paypalConfig from './paypal.config';
export default [
  DataBaseConfig,
  AppConfig,
  HelperConfig,
  RequestConfig,
  MailConfig,
  AuthConfig,
  FileConfig,
  StripeConfig,
  paypalConfig
];
