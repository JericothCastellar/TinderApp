import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UpdatePageRoutingModule } from './update-routing.module';
import { UpdatePage } from './update.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [UpdatePage]
})
export class UpdatePageModule {}
