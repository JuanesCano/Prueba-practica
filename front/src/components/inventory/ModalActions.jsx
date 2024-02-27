import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Modal } from "react-bootstrap";

const initialState = {
  product: "",
  amount: 0,
};

export const ModalActions = ({
  show,
  handleClose,
  getInventories,
  isEdit,
  inventoryEdit,
  resetState,
}) => {
  const [formState, setFormState] = useState(initialState);
  const [products, setProducts] = useState([]);

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

  //verificamos si se quiere editar la categoria
  useEffect(() => {
    isEdit
      ? setFormState({
          product: inventoryEdit.product._id,
          amount: inventoryEdit.amount,
        })
      : setFormState(initialState);
  }, [isEdit, inventoryEdit]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/inventory/${inventoryEdit._id}` : "/inventory";

      const method = isEdit ? "put" : "post";

      const { data } = await axios[method](url, formState);

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      await getInventories();
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
          {isEdit
            ? "Actualizar elemento de inventario"
            : "Crear elemento de inventario"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            className="mb-3"
            required
            as="select"
            type="select"
            name="product"
            onChange={(e) => handleChange(e)}
            value={formState.product}
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {products.map((item) => (
              <option value={item._id} key={item._id}>
                {item.name}
              </option>
            ))}
          </Form.Control>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad en kg</Form.Label>
            <Form.Control
              required
              name="amount"
              type="number"
              value={formState.amount}
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
