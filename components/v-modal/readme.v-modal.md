# V-Modal

Simple modal window with customizable width, padding, and close button.

## Basic Usage

```html
<v-modal [isOpen]="isModalOpen"
         (onClose)="closeModal()">
  <div>Modal content</div>
</v-modal>
```

## API

```ts
// Inputs
isOpen: boolean = false
isCloseButtonVisible: boolean = false
width: string = '400px'
borderRadius: CssUnitValue = 2
paddingY: CssUnitValue = 2
paddingX: CssUnitValue = 2

// Events
onClose: void
```

## Examples

```html
<!-- With header and footer -->
<v-modal [isOpen]="isModalOpen"
         (onClose)="closeModal()">
  <h2 v-header>Modal Header</h2>
  <div>Main content</div>
  <div v-footer>Footer content</div>
</v-modal>

<!-- With close button, custom width -->
<v-modal [isOpen]="isModalOpen"
         [isCloseButtonVisible]="true"
         width="600px"
         [borderRadius]="3"
         [paddingY]="3"
         [paddingX]="4"
         (onClose)="closeModal()">
  <div>Modal content</div>
</v-modal>

<!-- Form modal -->
<v-modal [isOpen]="showForm"
         [isCloseButtonVisible]="true"
         width="500px"
         [paddingY]="3"
         [paddingX]="3"
         (onClose)="hideForm()">
  <h3 v-header>Create Entry</h3>

  <form [formGroup]="myForm">
    <v-input label="Title" formControlName="title" />
    <v-input label="Description" formControlName="description" />
  </form>

  <div v-footer class="form-actions">
    <v-button primary (onClick)="saveForm()">Save</v-button>
    <v-button flat (onClick)="hideForm()">Cancel</v-button>
  </div>
</v-modal>

<!-- Confirmation dialog -->
<v-modal [isOpen]="showConfirmation"
         width="350px"
         [borderRadius]="3"
         (onClose)="cancelAction()">
  <h4 v-header>Confirm Action</h4>
  <p>Are you sure you want to delete this item?</p>
  <div v-footer>
    <v-button danger (onClick)="confirmDelete()">Delete</v-button>
    <v-button flat (onClick)="cancelAction()">Cancel</v-button>
  </div>
</v-modal>

<!-- Compact modal -->
<v-modal [isOpen]="showInfo"
         width="300px"
         [paddingY]="0"
         [paddingX]="0"
         (onClose)="closeInfo()">
  <div v-header>Quick Info</div>
  <p>Compact modal with minimal spacing</p>
  <div v-footer>
    <v-button flat (onClick)="closeInfo()">OK</v-button>
  </div>
</v-modal>
```
