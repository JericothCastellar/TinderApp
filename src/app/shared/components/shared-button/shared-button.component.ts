import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'shared-button',
  standalone: false,
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.scss'],
})
export class SharedButtonComponent implements OnInit {
  @Input() label: string = 'Submit';
    @Input() disabled: boolean = false;
  @Input() color: string = 'primary';
  @Output() action = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
