import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Modal } from "react-bootstrap";

const initialState = {
  name: "",
  description: "",
  category: "",
  price: "",
};

export const ModalActions = ({
  show,
  handleClose,
  getProducts,
  isEdit,
  productEdit,
  resetState,
}) => {
  const [formState, setFormState] = useState(initialState);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get("/category");
      setCategories(data.data);
    } catch (error) {
      console.log("error en getProducts", error.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  //verificamos si se quiere editar la categoria
  useEffect(() => {
    isEdit
      ? setFormState({ ...productEdit, category: productEdit.category._id })
      : setFormState(initialState);
  }, [isEdit, productEdit]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/product/${inventoryEdit._id}` : "/product";

      const method = isEdit ? "put" : "post";

      const { data } = await axios[method](url, formState);

      Swal.fire({
        position: "center",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });

      await getProducts();
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
          {isEdit ? "Actualizar producto" : "Crear producto"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>nombre producto</Form.Label>
            <Form.Control
              required
              name="name"
              placeholder="Nombre producto"
              value={formState.name}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripcion del producto</Form.Label>
            <Form.Control
              required
              name="description"
              placeholder="Descripcion del producto"
              value={formState.description}
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Categoria del producto</Form.Label>
            <Form.Control
              className="mb-3"
              required
              as="select"
              type="select"
              name="category"
              onChange={(e) => handleChange(e)}
              value={formState.category}
            >
              <option value="" disabled>
                Selecciona un categoria
              </option>

              {categories.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio producto</Form.Label>
            <Form.Control
              required
              name="price"
              type="number"
              placeholder="Precio del producto"
              value={formState.price}
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
