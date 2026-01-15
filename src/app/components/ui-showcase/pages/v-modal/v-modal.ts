import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VButton } from '@ui-kit/components/v-button/v-button';
import {
  ddExpandDirection,
  DropdownItem,
  VDropdown,
} from '@ui-kit/components/v-dropdown/v-dropdown';
import { VModal } from '@ui-kit/components/v-modal/v-modal';

@Component({
  selector: 'v-modal-page',
  templateUrl: './v-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VModal, VButton, VDropdown],
})
export class VModalPage {
  protected isModalOpen: string | null = null;
  protected isShowLongContent = false;
  protected selectedFoodItem = '';
  protected readonly ddExpandDirection = ddExpandDirection;

  protected readonly foodItems = [
    { label: 'Pizza', value: 'pizza' },
    { label: 'Burger', value: 'burger' },
    { label: 'Sushi', value: 'sushi' },
    { label: 'Pasta', value: 'pasta' },
    { label: 'Salad', value: 'salad' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Beverage', value: 'beverage' },
  ];

  protected openModal(type: string): void {
    this.isModalOpen = type;
    this.isShowLongContent = false;
    this.selectedFoodItem = '';
  }

  protected closeModal(): void {
    this.isModalOpen = null;
    this.isShowLongContent = false;
  }

  protected onFoodItemChange(item: DropdownItem | null): void {
    if (item) {
      this.selectedFoodItem = item.label;
      console.log('Selected food item:', item);
    } else {
      this.selectedFoodItem = '';
    }
  }
}
