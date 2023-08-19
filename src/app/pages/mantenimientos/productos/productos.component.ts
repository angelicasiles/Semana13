import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/shared/models/productos';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { AdminProductosComponent } from './admin-productos/admin-productos.component';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/shared/services/export.service';

// const ELEMENT_DATA: Productos[] = [];

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'categoria',
    'precio',
    'acciones',
  ];

  dataSource = new MatTableDataSource();

  constructor(
    private srvProductos: ProductosService,
    public dialog: MatDialog,
    private mensajeria: ToastrService,
    private srvExport: ExportService
  ) {}
  ngOnInit() {
    this.cargarlista();
  }

  cargarlista() {
    this.srvProductos.getAll().subscribe(
      (datos) => {
        // console.log(datos);
        this.dataSource.data = datos;
      },
      (error) => {
        this.mensajeria.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modificar(): void {
    alert('modificar');
  }

  eliminar(id: number): void {
    this.srvProductos.eliminar(id).subscribe(
      (dato) => {
        alert('Se eliminó el producto');
      },
      (err) => {
        alert('Error al eliminar');
      }
    );
  }

  detalle(dato: Productos): void {
    alert(dato.nombre);
  }

  abrirDialog(producto?: Productos): void {
    let dialogOpen;
    if (producto) {
      dialogOpen = this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
        data: { producto },
      });
    } else {
      dialogOpen = this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
      });
    }

    dialogOpen.afterClosed().subscribe((data) => {
      console.log(data);
      this.cargarlista();
    });
  }
  exportarHtml(){

    try {

      const page= document.querySelector('table')as HTMLElement

      this.srvExport.imprimirHTML(page,'tablaProductos')
      
    } catch (error) {
      
    }

  }
  //Se genera la funcionalidad del botón 
  exportar(){
    const datos=this.dataSource.data.map((pro:any)=>{
      //Va a sacar una lista 
      const row=[
        pro.id,
        pro.nombre,
        pro.categoria.nombre,
        pro.precio, 
        'nada'
      ]

      return row;

    })

    this.srvExport.imprimir(this.displayedColumns,datos, 'Lista de Productos', true, 'productos')



  }
}
