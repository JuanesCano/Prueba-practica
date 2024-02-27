import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { ModalActions } from "../components/products/ModalActions";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [productEdit, setProductEdit] = useState({});

  //obtenemos todos los inventarios desde el back
  const getProducts = async () => {
    try {
      const { data } = await axios.get("/product");
      setProducts(data.data);
    } catch (error) {
      console.log("error en getProducts", error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  //manejar el modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //manejar estado cuando se quiere editar
  const handleEdit = (product) => {
    setIsEdit(true);
    setProductEdit(product);
    handleShow();
  };

  //reset el state cuando se edite
  const resetState = () => {
    setIsEdit(false);
    setProductEdit({});
  };

  //eliminar inventario
  const deleteProduct = (id) => {
    try {
      Swal.fire({
        title: "Estas seguro que quieres eliminar el producto",
        text: "No prodras revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.delete(`/product/${id}`);
            Swal.fire({
              title: data.message,
              icon: "success",
              timer: 2000,
            });

            await getProducts();
          } catch (error) {
            if (!error.response.data.ok) {
              return Swal.fire({
                position: "center",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: true,
              });
            }
            console.log("error en deleteProduct", error.message);
          }
        }
      });
    } catch (error) {
      console.log("error en deleteProduct", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => handleShow()}>
        Crear producto
      </button>

      <Table responsive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.category.name}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
              <td>
                <div>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(item._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalActions
        show={show}
        handleClose={handleClose}
        getProducts={getProducts}
        isEdit={isEdit}
        productEdit={productEdit}
        resetState={resetState}
      />
    </div>
  );
};