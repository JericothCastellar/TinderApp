import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shared-input',
  standalone: false,
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.scss'],
})
export class SharedInputComponent {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
}
