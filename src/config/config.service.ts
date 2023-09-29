import { TcpClientOptions, Transport } from '@nestjs/microservices';
import { MongooseModuleOptions } from '@nestjs/mongoose';

require('dotenv').config();

/**
 * Common configuration Service
 */
class ConfigService {
  /**
   * Constructor of Configuration Service
   * @param env Array of required enviornment values
   */
  constructor(private env: { [k: string]: string | undefined }) {}

  /**
   * Get value of environment key's
   * @param key key of environment
   * @param throwOnMissing If it was true, it is required to run app
   * @returns The value of env
   */
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public get<T>(key: string, throwOnMissing = false): T {
    return this.getValue(key, throwOnMissing) as unknown as T;
  }

  /**
   * Get Mongo URL Address
   * @returns MongoDB URI
   */
  public getMongoDB_URL() {
    const baseUrl: string = `${
      this.getValue('MONGO_HOST', false) || 'localhost'
    }:${this.getValue('MONGO_PORT', false) || '27017'}`;
    const databaseName = this.getValue('DATABASE_NAME', true);
    const srv = this.getValue('MONGO_SRV', false) || false;

    let uri: string = `mongodb${srv ? '+srv' : ''}://`;
    if (
      this.getValue('DATABASE_USER', false) &&
      this.getValue('DATABASE_PASSWORD', false)
    ) {
      uri = `${uri}${this.getValue('DATABASE_USER', false)}:${this.getValue(
        'DATABASE_PASSWORD',
        false,
      )}@`;
    }

    uri = `${uri}${baseUrl}/${databaseName}`;
    return uri;
  }

  /**
   * Get MongoDB Connection Options
   * @returns MongoDB Connection Options
   */
  public getMongoDBOptions(): MongooseModuleOptions {
    const uri: string = this.getMongoDB_URL();
    const admin = this.getValue('MONGO_ADMIN', false) || 'false';
    console.log(`Mongo uri: ${uri}`);
    const mongooseOptions: MongooseModuleOptions = {
      uri,
    };

    if (admin.toLowerCase() === 'true') {
      mongooseOptions.authSource = 'admin';
      mongooseOptions.ssl = true;
    }

    return mongooseOptions;
  }

  /**
   * Check required key's are exist. If not, app does not run
   * @param keys List of required key's
   * @returns
   */
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  /**
   * Get Port
   * @returns Port value of service
   */
  public getPort() {
    return parseInt(this.getValue('PORT', true));
  }

  /**
   * Production Mode
   * @returns true/false
   */
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  /**
   * User Microservice Connection
   * @returns User Microservice Connection Options
   */
  public getUserService(): TcpClientOptions {
    return {
      options: {
        port: parseInt(this.getValue('USER_SERVICE_PORT', true)),
        host: this.getValue('USER_SERVICE_HOST', true).toString(),
      },
      transport: Transport.TCP,
    };
  }

  /**
   * Google Client Id Key
   * @returns Google Client Id Key
   */
  public getGoogleClientId = () => this.getValue('GOOGLE_CLIENT_ID', true);

  /**
   * Google Secret Key
   * @returns Google Secret Key
   */
  public getGoogleSecret = () => this.getValue('GOOGLE_SECRET', true);

  /**
   * Google Authentication Redirect Endpoint
   * @returns Google Authentication Redirect Endpoint
   */
  public getGoogleRedirect = () =>
    `${this.getValue('HOST', true)}:${this.getValue(
      'PORT',
      true,
    )}/${this.getValue('GOOGLE_REDIRECT', true)}`;

  /**
   * Linkedin Client Id Key
   * @returns Linkedin Client Id Key
   */
  public getLinkedInClientId = () => this.getValue('LINKEDIN_CLIENT_ID', true);

  /**
   * Linkedin Secret Key
   * @returns Linkedin Secret Key
   */
  public getLinkedInSecret = () => this.getValue('LINKEDIN_SECRET', true);

  /**
   * Linkedin Authentication Redirect Endpoint
   * @returns Linkedin Authentication Redirect Endpoint
   */
  public getLinkedInRedirect = () =>
    `${this.getValue('HOST', true)}:${this.getValue(
      'PORT',
      true,
    )}/${this.getValue('LINKEDIN_REDIRECT', true)}`;
}

/**
 * An object of Configuration
 */
const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'HOST',
]);

export { configService };
