import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Modal } from "react-bootstrap";

const initialState = {
  name: "",
  lastname: "", 
  cc: ""
};

export const ModalActions = ({
  show,
  handleClose,
  getClients,
  isEdit,
  clientEdit,
  resetState,
}) => {
  const [formState, setFormState] = useState(initialState);

  //verificamos si se quiere editar la categoria
  useEffect(() => {
    isEdit ? setFormState({ ...clientEdit }) : setFormState(initialState);
  }, [isEdit, clientEdit]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/client/${clientEdit._id}` : "/client";

      const method = isEdit ? "put" : "post";

      const { data } = await axios[method](url, formState);

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      await getClients();
      resetState();
      handleClose();
    } catch (error) {
      if (!error.response.data.ok) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: true,
        });
      }
      console.log("error en handleSubmit", error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Actualizar cliente" : "Crear cliente"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              required
              name="name"
              placeholder="Nombre"
              value = {formState.name}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              required
              name="lastname"
              placeholder="Apellido"
              value = {formState.lastname}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cedula</Form.Label>
            <Form.Control
              required
              name="cc"
              placeholder="Cedula"
              value = {formState.cc}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <button className="btn btn-primary" type="submit">
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};