import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prod',
}

export class EnvironmentService {
  /**
   * appPath has to be the path to your app starting from the package.json, where every directory is an item of the array.
   * Example: For connect-services it will be ['apps', 'connect-services'].
   */
  public static buildPaths(appPath: string[]): string[] {
    const env =
      (
        process.env.ENV ??
        process.env.APP_ENV ??
        process.env.NODE_ENV
      )?.toLowerCase() ?? '';

    return [
      path.resolve(...appPath, `.env.${env}.local`),
      path.resolve(...appPath, '.env.local'),
      path.resolve(...appPath, `.env.${env}`),
      path.resolve(...appPath, '.env'),
    ];
  }

  /**
   * appPath has to be the path to your app starting from the package.json, where every directory is an item of the array.
   * Example: For connect-services it will be ['apps', 'connect-services'].
   */
  public static loadFiles(appPath: string[]): void {
    const envFilePaths = EnvironmentService.buildPaths(appPath);
    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        dotenv.config({ path: envFilePath });
      }
    }
  }
}
