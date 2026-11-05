// src/app/services/producto.service.ts

// Service: decorador de Angular 22 (servicio disponible en toda la app)
// inject: obtiene dependencias sin usar el constructor
import { inject, Service } from '@angular/core';
// HttpClient para las peticiones; HttpParams para los parámetros de consulta
import { HttpClient, HttpParams } from '@angular/common/http';
// Observable para manejar operaciones asíncronas
import { Observable } from 'rxjs';
// Modelo Producto
import { Producto } from '../models/producto.model';
// URL base según el entorno (desarrollo / producción)
import { environment } from '../../environments/environment';

/**
 * Servicio para todas las operaciones CRUD de productos.
 * @Service() = @Injectable({ providedIn: 'root' })
 */
@Service()
export class ProductoService {
  // HttpClient ya viene incluido en Angular 22: no hace falta provideHttpClient()
  private readonly http = inject(HttpClient);

  // URL base de la API, p. ej. http://localhost:8888/angular22/crudelectronica/backend-php/productos
  private readonly apiUrl = `${environment.apiUrl}/productos`;

  /** Obtiene todos los productos */
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /** Obtiene un producto por su ID */
  get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /** Crea un nuevo producto */
  create(data: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, data);
  }

  /** Actualiza un producto existente */
  update(id: number, data: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, data);
  }

  /** Elimina un producto por su ID */
  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Busca productos cuyo nombre contenga el texto indicado */
  findByNombre(nombre: string): Observable<Producto[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
}