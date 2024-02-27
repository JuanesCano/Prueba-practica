import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Modal } from "react-bootstrap";

const initialState = {
  total: "",
  amount: "",
  client: "",
  product: "",
};

export const ModalActions = ({
  show,
  handleClose,
  getSales,
  isEdit,
  saleEdit,
  resetState,
}) => {
  const [formState, setFormState] = useState(initialState);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const getClients = async () => {
    try {
      const { data } = await axios.get("/client");
      setClients(data.data);
    } catch (error) {
      console.log("error en getClients", error.message);
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await axios.get("/product");
      setProducts(data.data);
    } catch (error) {
      console.log("error en getProducts", error.message);
    }
  };

  useEffect(() => {
    getClients();
    getProducts();
  }, []);

  const handleChange = (e) => {
    setFormState({...formState, [e.target.name] : e.target.value})
  }

  //verificamos si se quiere editar la categoria
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/sale`, formState);

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      await getSales();
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
        <Modal.Title>Crear venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              className="mb-3"
              required
              as="select"
              type="select"
              name="client"
              onChange={(e) => handleChange(e)}
              value={formState.client}
            >
              <option value="" disabled>
                Selecciona un categoria
              </option>

              {clients.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Producto</Form.Label>
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
                Selecciona un categoria
              </option>

              {products.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>cantidad del producto</Form.Label>
            <Form.Control
              required
              name="amount"
              type="number"
              placeholder="Cantidad en kilo gramos"
              value={formState.amount}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <button className="btn btn-primary" type="submit">
            Crear
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
