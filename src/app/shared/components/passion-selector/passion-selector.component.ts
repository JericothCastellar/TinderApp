import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'passion-selector',
  standalone: false,
  templateUrl: './passion-selector.component.html',
  styleUrls: ['./passion-selector.component.scss']
})
export class PassionSelectorComponent {
  @Input() passions: string[] = [];
  @Input() selected: string[] = [];
  @Output() toggle = new EventEmitter<string>();

  isSelected(passion: string): boolean {
    return this.selected.includes(passion);
  }

  onToggle(passion: string) {
    this.toggle.emit(passion);
  }
}
