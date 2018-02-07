import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
//import { CdkTableModule } from '@angular/cdk/table';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { BrowserModule } from '@angular/platform-browser';

import 'hammerjs';
import '../polyfills';

const sharedModules: any[] = [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    //BrowserAnimationsModule,
    //BrowserModule,
    //platformBrowserDynamic,
    //FormsModule,
    //ReactiveFormsModule,
    //CdkTableModule
];

@NgModule({
    imports: sharedModules,
    exports: sharedModules
})

export class SharedModule { }
