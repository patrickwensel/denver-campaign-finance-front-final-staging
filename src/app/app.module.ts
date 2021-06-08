import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, ErrorHandler } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpErrorInterceptor } from "./core/interceptor/http-error.interceptor";
import { TokenInterceptor } from "./core/interceptor/authentication.interceptor";
import { CommonMethods } from "src/app/core";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './modules/auth/login/login.component';
import { SharedModule } from "./shared/modules/shared.module";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
import {
  Authguard,
  AuthService,
   LoginAuthguard, MasterDataService,
} from "src/app/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './shared/modules/material.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { from } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { LoaderComponent } from "./shared/components/loader/loader.component";
import { LoginLayoutComponent } from "./shared/components/login-layout/login-layout.component";
import { NavLayoutComponent } from "./shared/components/nav-layout/nav-layout.component";
import { HomeLayoutComponent } from "./shared/components/home-layout/home-layout.component";

import { SidenavcomponentComponent } from './shared/sidenavcomponent/sidenavcomponent.component';
import { CommitteeHomeLayoutComponent } from './shared/components/committee-home-layout/committee-home-layout.component';
import { DataService, TransferDataService } from './core/services/data-service';
import { SentryErrorHandler } from './core/services/sentry.service';
import { TraceService } from '@sentry/angular';
import { Router } from '@angular/router';
import { HelpsModule } from './modules/helps/helps.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    NavLayoutComponent,
    HomeLayoutComponent,
    SidenavcomponentComponent,
    CommitteeHomeLayoutComponent,
    // MsgscreenRightPanelComponent,

    // LoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MaterialModule,
    SharedModule,
    FlexLayoutModule,
    HelpsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    DataService,
    TransferDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    //  {
    //   provide: ErrorHandler,
    //   useClass: SentryErrorHandler,
    // },
    // {
    //   provide: TraceService,
    //   deps: [Router],
    // },
    CommonMethods,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
