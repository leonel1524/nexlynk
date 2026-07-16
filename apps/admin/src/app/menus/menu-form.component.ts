import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <a [routerLink]="['/businesses', businessId, 'menus']" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver a menús
        </a>
      </div>

      <div class="card">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Editar menú' : 'Crear nuevo menú' }}
        </h1>

        <form [formGroup]="menuForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="label">Nombre del menú *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="input-field"
              placeholder="Menú Principal"
            />
            @if (menuForm.get('name')?.invalid && menuForm.get('name')?.touched) {
              <p class="error-text">El nombre es requerido</p>
            }
          </div>

          <div>
            <label for="description" class="label">Descripción</label>
            <textarea
              id="description"
              formControlName="description"
              class="input-field"
              rows="2"
              placeholder="Describe este menú..."
            ></textarea>
          </div>

          <!-- Categories -->
          <div formArrayName="categories" class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Categorías</h2>
              <button type="button" (click)="addCategory()" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Agregar categoría
              </button>
            </div>

            @for (category of categories.controls; track $index; let i = $index) {
              <div [formGroupName]="i" class="border border-gray-200 rounded-xl p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Categoría {{ i + 1 }}</span>
                  <button type="button" (click)="removeCategory(i)" class="text-red-500 hover:text-red-600 text-sm">
                    Eliminar
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Nombre *</label>
                    <input type="text" formControlName="name" class="input-field" placeholder="Entradas" />
                  </div>
                  <div>
                    <label class="label">Descripción</label>
                    <input type="text" formControlName="description" class="input-field" placeholder="Opcional" />
                  </div>
                </div>

                <!-- Items -->
                <div [formArrayName]="'items'" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Items</span>
                    <button type="button" (click)="addItem(i)" class="text-brand hover:text-brand-dark text-xs font-medium flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Agregar item
                    </button>
                  </div>

                  @for (item of getCategoryItems(i).controls; track $index; let j = $index) {
                    <div [formGroupName]="j" class="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                      <div class="flex-1">
                        <input type="text" formControlName="name" class="input-field text-sm" placeholder="Nombre del item" />
                      </div>
                      <div class="w-24">
                        <input type="number" formControlName="price" class="input-field text-sm" placeholder="Precio" step="0.01" />
                      </div>
                      <button type="button" (click)="removeItem(i, j)" class="text-red-400 hover:text-red-500 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" [disabled]="menuForm.invalid || isLoading" class="btn-primary">
              {{ isEditing ? 'Guardar cambios' : 'Crear menú' }}
            </button>
            <a [routerLink]="['/businesses', businessId, 'menus']" class="btn-ghost">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  businessId: string = '';
  menuId: string | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categories: this.fb.array([])
    });
  }

  get categories(): FormArray {
    return this.menuForm.get('categories') as FormArray;
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    this.menuId = this.route.snapshot.paramMap.get('menuId');

    if (this.menuId) {
      this.isEditing = true;
      this.loadMenu();
    }
  }

  loadMenu(): void {
    if (!this.menuId) return;

    this.businessService.getMenuById(this.businessId, this.menuId).subscribe({
      next: (response) => {
        const menu = response.data;
        if (menu) {
          this.menuForm.patchValue({
            name: menu.name,
            description: menu.description
          });

          // Load categories
          if ((menu as any).menu_categories) {
            for (const cat of (menu as any).menu_categories) {
              const catForm = this.createCategoryForm();
              catForm.patchValue({
                name: cat.name,
                description: cat.description
              });

              const itemsArray = catForm.get('items') as FormArray;
              if (cat.menu_items) {
                for (const item of cat.menu_items) {
                  itemsArray.push(this.createItemForm(item.name, item.price));
                }
              }

              this.categories.push(catForm);
            }
          }
        }
      }
    });
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      items: this.fb.array([])
    });
  }

  createItemForm(name = '', price: number | null = null): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      description: [''],
      price: [price]
    });
  }

  getCategoryItems(categoryIndex: number): FormArray {
    return this.categories.at(categoryIndex).get('items') as FormArray;
  }

  addCategory(): void {
    this.categories.push(this.createCategoryForm());
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  addItem(categoryIndex: number): void {
    this.getCategoryItems(categoryIndex).push(this.createItemForm());
  }

  removeItem(categoryIndex: number, itemIndex: number): void {
    this.getCategoryItems(categoryIndex).removeAt(itemIndex);
  }

  onSubmit(): void {
    if (this.menuForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.menuForm.value;

    // Clean up empty items
    const payload = {
      ...formValue,
      categories: formValue.categories.map((cat: any) => ({
        ...cat,
        items: (cat.items || []).filter((item: any) => item.name?.trim())
      }))
    };

    const request = this.isEditing
      ? this.businessService.updateMenu(this.businessId, this.menuId!, payload)
      : this.businessService.createMenu(this.businessId, payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/businesses', this.businessId, 'menus']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al guardar el menú';
      }
    });
  }
}
