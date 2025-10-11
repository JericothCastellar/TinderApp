import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedButtonComponent } from './components/shared-button/shared-button.component';
import { SharedInputComponent } from './components/shared-input/shared-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PassionSelectorComponent } from './components/passion-selector/passion-selector.component';

@NgModule({
  declarations: [
    SharedInputComponent,
    SharedButtonComponent,
    PassionSelectorComponent
  ],
  exports: [
    SharedInputComponent,
    SharedButtonComponent,
    PassionSelectorComponent 
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
