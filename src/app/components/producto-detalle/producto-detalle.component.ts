// src/app/components/producto-detalle/producto-detalle.component.ts

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

/**
 * Muestra y modifica los detalles de un producto en una página propia (no en diálogo).
 */
@Component({
  selector: 'app-producto-detalle',
  imports: [FormsModule, RouterLink, MatButtonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.scss'
})
export class ProductoDetalleComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // Producto actual (null mientras carga) y mensaje de error, en signals
  readonly currentProducto = signal<Producto | null>(null);
  readonly message = signal('');

  /** Lee el :id de la URL y carga el producto */
  ngOnInit(): void {
    this.obtenerProducto(Number(this.route.snapshot.paramMap.get('id')));
  }

  obtenerProducto(id: number): void {
    this.productoService.get(id).subscribe({
      next: data => this.currentProducto.set(data),
      error: e => {
        console.error(e);
        this.message.set('No se encontró el producto.');
      }
    });
  }

  actualizarProducto(): void {
    const producto = this.currentProducto();
    if (!producto?.id) return;

    this.productoService.update(producto.id, producto).subscribe({
      next: () => {
        this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: e => console.error(e)
    });
  }

  eliminarProducto(): void {
    const producto = this.currentProducto();
    if (!producto?.id) return;

    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.delete(producto.id).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
          this.snackBar.open('Producto eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: e => console.error(e)
      });
    }
  }
}