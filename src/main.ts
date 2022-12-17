import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { preloaderFinished } from '@delon/theme';
import { platformBrowser } from '@angular/platform-browser'

preloaderFinished();

import { hmrBootstrap } from './hmr';

import { AppInjector } from './app/modules/base_module/services/app-injector.service';
import 'zone.js/dist/zone';  // Included with Angular CLI.
import './assets/config/cordova-config.js'

const option: any = {
  defaultEncapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
}
// TODO 调试完移动端之后应当移除 vconsole
if (environment.name === 'staging' && environment.inApp) {
  const VConsole = require('vconsole')
  localStorage.setItem('vConsole_switch_x', '0')
  localStorage.setItem('vConsole_switch_y', (window.screen.height - 100).toString())
  new VConsole()
  // option.ngZone = 'noop';
}

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule, option)
    .then(res => {
      AppInjector.setInjector(res.injector);
      if ((<any>window).appBootstrap) {
        (<any>window).appBootstrap();
      }
      return res;
    });
};

if (environment.hmr) {
  if (module['hot']) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
  } else {
    bootstrap();
}
