import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { VCard } from '@ui-kit/components/v-card/v-card';
import {
  ddExpandDirection,
  DropdownItem,
  VDropdown,
} from '@ui-kit/components/v-dropdown/v-dropdown';
import { VModal } from '@ui-kit/components/v-modal/v-modal';

@Component({
  selector: 'v-dropdown-page',
  templateUrl: './v-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VDropdown, VButton, VCard, VModal],
})
export class VDropdownPage {
  protected readonly ddExpandDirection = ddExpandDirection;
  protected selectedFoodItem = '';
  protected isModalOpen = false;

  protected readonly foodItems = [
    { label: 'Pizza', value: 'pizza' },
    { label: 'Burger', value: 'burger' },
    { label: 'Sushi', value: 'sushi' },
    { label: 'Pasta', value: 'pasta' },
    { label: 'Salad', value: 'salad' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Beverage', value: 'beverage' },
  ];

  protected openModal(): void {
    this.isModalOpen = true;
  }

  protected closeModal(): void {
    this.isModalOpen = false;
  }

  protected onFoodItemChange(item: DropdownItem | null): void {
    if (item) {
      this.selectedFoodItem = item.label;
      console.log('Selected food item:', item);
    } else {
      this.selectedFoodItem = '';
      console.log('No item selected');
    }
  }
}
