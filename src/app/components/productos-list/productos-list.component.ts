// src/app/components/productos-list/productos-list.component.ts

// Angular
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // para [(ngModel)] del buscador
// Angular Material
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Modelo, servicio y formulario que se abre en el diálogo
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

/**
 * Lista de productos con búsqueda, paginación y acciones.
 * Standalone + OnPush (por defecto en Angular 22).
 */
@Component({
  selector: 'app-productos-list',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss'
})
export class ProductosListComponent implements OnInit {
  // Dependencias con inject() (sustituye a los parámetros del constructor)
  private readonly productoService = inject(ProductoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Columnas que se mostrarán en la tabla
  readonly displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'acciones'];

  // Estado en signals: al cambiar, Angular repinta la plantilla
  readonly productos = signal<Producto[]>([]);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  // Página visible = trozo del array según página y tamaño
  readonly paginaActual = computed(() => {
    const inicio = this.pageIndex() * this.pageSize();
    return this.productos().slice(inicio, inicio + this.pageSize());
  });

  // Término de búsqueda (lo actualiza el propio input, no hace falta signal)
  nombreBusqueda = '';

  /** Al iniciar el componente cargamos los productos */
  ngOnInit(): void {
    this.obtenerProductos();
  }

  /** Obtiene todos los productos */
  obtenerProductos(): void {
    this.productoService.getAll().subscribe({
      next: data => this.cargar(data),
      error: e => console.error(e)
    });
  }

  /** Busca por nombre; si el campo está vacío, recarga todo */
  buscarPorNombre(): void {
    const texto = this.nombreBusqueda.trim();
    this.pageIndex.set(0); // volver a la página 1 tras filtrar

    if (texto) {
      this.productoService.findByNombre(texto).subscribe({
        next: data => this.cargar(data),
        error: e => console.error(e)
      });
    } else {
      this.obtenerProductos();
    }
  }

  /** Evento (page) del paginador: guarda página y tamaño */
  cambiarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }

  /** Abre el formulario en un diálogo (crear si no hay producto, editar si lo hay) */
  abrirFormulario(producto?: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '500px',
      data: producto || {}
    });

    // Si el diálogo se cerró con resultado (no se canceló), recargamos
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerProductos();
      }
    });
  }

  /** Elimina un producto tras confirmarlo */
  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.obtenerProductos();
        },
        error: e => console.error(e)
      });
    }
  }

  /** Guarda los datos y corrige la página si se ha quedado vacía (p. ej. tras borrar) */
  private cargar(data: Producto[]): void {
    this.productos.set(data);
    const ultimaPagina = Math.max(0, Math.ceil(data.length / this.pageSize()) - 1);
    if (this.pageIndex() > ultimaPagina) {
      this.pageIndex.set(ultimaPagina);
    }
  }
}