import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { ModalActions } from "../components/clients/ModalActions";

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [clientEdit, setClientEdit] = useState({});

  //obtenemos todas los clientes desde el back
  const getClients = async () => {
    try {
      const { data } = await axios.get("/client");
      setClients(data.data);
    } catch (error) {
      console.log("error en getClients", error.message);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  //manejar el modal
  const [show, setShow] = useState(false);

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //manejar estado cuando se quiere editar
  const handleEdit = (client) => {
    setIsEdit(true);
    setClientEdit(client);
    handleShow();
  };

  //reset el state cuando se edite
  const resetState = () => {
    setIsEdit(false);
    setClientEdit({});
  };

  //eliminar cliente
  const deleteClient = (id) => {
    try {
      Swal.fire({
        title: "Estas seguro que quieres eliminar el cliente",
        text: "No prodras revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axios.delete(`/client/${id}`);
            Swal.fire({
              title: data.message,
              icon: "success",
              timer: 2000,
            });

            await getClients();
          } catch (error) {
            if (!error.response.data.ok) {
              return Swal.fire({
                position: "center",
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: true,
              });
            }
            console.log("error en deleteClients", error.message);
          }
        }
      });
    } catch (error) {
      console.log("error en deleteClients", error.message);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => handleShow()}>
        Crear cliente
      </button>

      <Table responsive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cedula</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((item, i) => (
            <tr key={item._id}>
              <td>{i + 1}</td>
              <td>{item?.name}</td>
              <td>{item?.lastname}</td>
              <td>{item?.cc}</td>
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
                    onClick={() => deleteClient(item._id)}
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
        getClients={getClients}
        isEdit={isEdit}
        clientEdit={clientEdit}
        resetState={resetState}
      />
    </div>
  );
};
