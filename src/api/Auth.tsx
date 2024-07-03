/* eslint-disable sort-keys */
import siteConfig from 'src/siteConfig';

import { WPLoginReponse, WPValidateReponse } from 'src/types/wp-rest-api';

class AuthClass {
  static async Login(username: string, password: string) {
    const doAuth = await fetch(`${siteConfig.cmsDomain}/wp-json/jwt-auth/v1/token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const auth: WPLoginReponse = await doAuth.json();

    return auth;
  }

  static async Validate(token: string) {
    const isValid = await fetch(`${siteConfig.cmsDomain}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const valid: WPValidateReponse = await isValid.json();

    return {
      isValidUser: valid.data.status === 200
    };
  }
}

export default AuthClass;
