import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { ModalActions } from "../components/sales/ModalActions";

export const Sales = () => {
  const [sales, setSales] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [saleEdit, setSaleEdit] = useState({});

  //obtenemos todos los inventarios desde el back
  const getSales = async () => {
    try {
      const { data } = await axios.get("/sale");
      setSales(data.data);
    } catch (error) {
      console.log("error en getProducts", error.message);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  //manejar el modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //manejar estado cuando se quiere editar
  const handleEdit = (sale) => {
    setIsEdit(true);
    setSaleEdit(sale);
    handleShow();
  };

  //reset el state cuando se edite
  const resetState = () => {
    setIsEdit(false);
    setSaleEdit({});
  };

  //eliminar inventario
  const deleteSale = (id) => {
    try {
      Swal.fire({
        title: "Estas seguro que quieres eliminar esta factura",
        text: "No prodras revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.delete(`/sale/${id}`);
            Swal.fire({
              title: data.message,
              icon: "success",
              timer: 2000,
            });

            await getSales();
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
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item?.client?.name}</td>
              <td>{item?.product?.name}</td>
              <td>{item?.amount}</td>
              <td>{item?.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalActions
        show={show}
        handleClose={handleClose}
        getSales={getSales}
        isEdit={isEdit}
        saleEdit={saleEdit}
        resetState={resetState}
      />
    </div>
  );
};