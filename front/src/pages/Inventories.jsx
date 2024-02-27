import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { ModalActions } from "../components/inventory/ModalActions";

export const Inventories = () => {
  const [inventories, setInventories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [inventoryEdit, setInventoryEdit] = useState({});

  //obtenemos todos los inventarios desde el back
  const getInventories = async () => {
    try {
      const { data } = await axios.get("/inventory");
      setInventories(data.data);
    } catch (error) {
      console.log("error en getInventories", error.message);
    }
  };

  useEffect(() => {
    getInventories();
  }, []);

  //manejar el modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //manejar estado cuando se quiere editar
  const handleEdit = (inventory) => {
    setIsEdit(true);
    setInventoryEdit(inventory);
    handleShow();
  };

  //reset el state cuando se edite
  const resetState = () => {
    setIsEdit(false);
    setInventoryEdit({});
  };

  //eliminar inventario
  const deleteInventory = (id) => {
    try {
      Swal.fire({
        title: "Estas seguro que quieres eliminar el inventario",
        text: "No prodras revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.delete(`/inventory/${id}`);
            Swal.fire({
              title: data.message,
              icon: "success",
              timer: 2000,
            });

            await getInventories();
          } catch (error) {
            if (!error.response.data.ok) {
              return Swal.fire({
                position: "center",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: true,
              });
            }
            console.log("error en deleteInventory", error.message);
          }
        }
      });
    } catch (error) {
      console.log("error en deleteInventory", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => handleShow()}>
        Crear inventario
      </button>

      <Table responsive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre producto</th>
            <th>Cantidad</th>
            <th>Categoria</th>
          </tr>
        </thead>

        <tbody>
          {inventories.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item?.product?.name}</td>
              <td>{item?.amount}</td>
              <td>{item?.product?.category?.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalActions
        show={show}
        handleClose={handleClose}
        getInventories={getInventories}
        isEdit={isEdit}
        inventoryEdit={inventoryEdit}
        resetState={resetState}
      />
    </div>
  );
};