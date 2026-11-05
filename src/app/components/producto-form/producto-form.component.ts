// src/app/components/producto-form/producto-form.component.ts

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Diálogo de Material: directivas (mat-dialog-title, -content, -actions) y tokens
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

/**
 * Formulario de creación y edición de productos.
 * Normalmente se muestra dentro de un diálogo de Angular Material.
 */
@Component({
  selector: 'app-producto-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  // { optional: true } -> null si el componente no se abrió en un diálogo (ruta /add)
  readonly dialogRef = inject<MatDialogRef<ProductoFormComponent>>(MatDialogRef, { optional: true });
  private readonly data = inject<Partial<Producto> | null>(MAT_DIALOG_DATA, { optional: true });

  // Producto recibido (vacío al crear)
  private readonly producto: Partial<Producto> = this.data ?? {};

  // ¿Editando (true) o creando (false)? Edición si el producto tiene ID
  readonly isEditing = !!this.producto.id;

  // Formulario reactivo con valores iniciales y validadores
  readonly productoForm = this.fb.nonNullable.group({
    nombre: [this.producto.nombre ?? '', [Validators.required, Validators.minLength(3)]],
    descripcion: [this.producto.descripcion ?? '', [Validators.required]],
    precio: [this.producto.precio ?? 0, [Validators.required, Validators.min(0)]],
    stock: [this.producto.stock ?? 0, [Validators.required, Validators.min(0)]]
  });

  /** Crea o actualiza según el modo */
  onSubmit(): void {
    if (this.productoForm.invalid) {
      return;
    }

    // getRawValue() devuelve { nombre, descripcion, precio, stock } con tipos
    const producto: Producto = this.productoForm.getRawValue();

    if (this.isEditing) {
      this.productoService.update(this.producto.id!, producto).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.cerrar(true);
        },
        error: e => console.error(e)
      });
    } else {
      this.productoService.create(producto).subscribe({
        next: () => {
          this.snackBar.open('Producto creado correctamente', 'Cerrar', { duration: 3000 });
          this.cerrar(true);
        },
        error: e => console.error(e)
      });
    }
  }

  /** Cancela sin devolver resultado */
  cancelar(): void {
    this.cerrar();
  }

  /** Cierra el diálogo o, si no hay diálogo, vuelve a la lista */
  private cerrar(resultado?: boolean): void {
    if (this.dialogRef) {
      this.dialogRef.close(resultado);
    } else {
      this.router.navigate(['/productos']);
    }
  }
}