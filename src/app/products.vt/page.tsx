'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import '../../styles/globals.css';
import { Table, Button, Modal, Form, Alert, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSync, faFileEdit } from '@fortawesome/free-solid-svg-icons';
import { CircleLoader } from 'react-spinners';
import CustomPagination from '../../components/Pagination';

interface Product {
  productID: number;
  name: string;
  productDescription: string;
  hsnHacCode: string;
  stock: number;
  gstPercentage: number;
  sellPrice: number;
  sellPriceIncludingTax: number;
  purchasePrice: number;
  purchasePriceIncludingTax: number;
  productType: string;
  cessAmount: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    productDescription: '',
    hsnHacCode: '',
    stock: 0,
    gstPercentage: 0,
    sellPrice: 0,
    sellPriceIncludingTax: 0,
    purchasePrice: 0,
    purchasePriceIncludingTax: 0,
    productType: 'TAXABLE',
    cessAmount: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  /*Table Pagination Variables*/
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    setLoading(true); // Start loading indicator
    // Introduce a delay to ensure spinner is visible
    const minSpinnerDuration = 500; // Minimum duration in milliseconds
    const startTime = Date.now();
    try {
      const response = await axios.get('http://localhost:9001/products/findall.vt');
      setProducts(response.data.productDTOList || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      // Calculate the elapsed time and adjust the timeout accordingly
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSpinnerDuration - elapsedTime);

      setTimeout(() => {
        setLoading(false); // End loading indicator
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productID: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      try {
        await axios.post('http://localhost:9001/products/deleteproduct.vt', { productID });
        fetchProducts(); // Refetch products after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (validateEditForm()) {
      if (editProduct) {
        try {
          await axios.post('http://localhost:9001/products/edit.vt', editProduct);
          setShowEditModal(false);
          fetchProducts(); // Refetch products after editing
        } catch (error) {
          console.error('Error editing product:', error);
        }
      }
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const validateAddForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newProduct.name) newErrors.name = 'Product Name is required';
    if (!newProduct.hsnHacCode) newErrors.hsnHacCode = 'HSN/HAC Code is required';
    if (newProduct.gstPercentage <= 0) newErrors.gstPercentage = 'GST Percentage is required';
    if (newProduct.sellPrice <= 0) newErrors.sellPrice = 'Sell Price is required';
    if (newProduct.sellPriceIncludingTax <= 0) newErrors.sellPriceIncludingTax = 'Sell Price Including Tax is required';
    if (newProduct.purchasePrice <= 0) newErrors.purchasePrice = 'Purchase Price is required';
    if (newProduct.purchasePriceIncludingTax <= 0) newErrors.purchasePriceIncludingTax = 'Purchase Price Including Tax is required';
    if (!newProduct.productType) newErrors.productType = 'Product Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editProduct?.name) newErrors.name = 'Product Name is required';
    if (!editProduct?.hsnHacCode) newErrors.hsnHacCode = 'HSN/HAC Code is required';
    if (editProduct?.gstPercentage === null ||
      editProduct?.gstPercentage === undefined ||
      isNaN(editProduct.gstPercentage) ||
      editProduct.gstPercentage <= 0) {
      newErrors.gstPercentage = 'GST Percentage is required and must be greater than 0';
    }
    if (editProduct?.sellPrice === null ||
      editProduct?.sellPrice === undefined ||
      isNaN(editProduct.sellPrice) ||
      editProduct.sellPrice <= 0) {
      newErrors.sellPrice = 'Sell Price is required and must be greater than 0';
    }
    if (editProduct?.sellPriceIncludingTax === null ||
      editProduct?.sellPriceIncludingTax === undefined ||
      isNaN(editProduct.sellPriceIncludingTax) ||
      editProduct.sellPriceIncludingTax <= 0) {
      newErrors.sellPriceIncludingTax = 'Sell Price Including Tax is required and must be greater than 0';
    }
    if (editProduct?.purchasePrice === null ||
      editProduct?.purchasePrice === undefined ||
      isNaN(editProduct.purchasePrice) ||
      editProduct.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase Price is required and must be greater than 0';
    }
    if (editProduct?.purchasePriceIncludingTax === null ||
      editProduct?.purchasePriceIncludingTax === undefined ||
      isNaN(editProduct.purchasePriceIncludingTax) ||
      editProduct.purchasePriceIncludingTax <= 0) {
      newErrors.purchasePriceIncludingTax = 'Purchase Price Including Tax is required and must be greater than 0';
    }
    if (!editProduct?.productType) newErrors.productType = 'Product Type is required';

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (validateAddForm()) {
      try {
        await axios.post('http://localhost:9001/products/add.vt', newProduct);
        setShowModal(false);
        fetchProducts(); // Refetch products after adding new product
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(products.length / rowsPerPage);

  return (
    <div className="products-container">
      <div className="product-hero">
        <h1 className="products-title">Products</h1>
        <div className="action-btn-and-refresh">
          <Button className="add-product-button" variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Add Product
          </Button>
          <Button className="refresh-product-button" variant="primary" size="sm" onClick={fetchProducts}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <Alert variant="info">
              <div className="alert-content">
                <CircleLoader color="#007bff" size={30} />
                <span className="loading-text">Loading Data...</span>
              </div>
            </Alert>
          ) : products.length === 0 ? (
            <Alert variant="warning">No Products in Product Table</Alert>
          ) : (
            <>
              <Table bordered hover size="sm" className="table-custom">
                <thead>
                  <tr>
                    <th style={{ width: '3%' }}>ID</th>
                    <th style={{ width: '40%' }}>Name</th>
                    <th style={{ width: '4%' }}>HSN Code</th>
                    <th style={{ width: '10%' }}>Stock</th>
                    <th style={{ width: '10%' }}>GST %</th>
                    <th style={{ width: '15%' }}>Sell Price</th>
                    <th style={{ width: '15%' }}>Purchase Price</th>
                    <th style={{ width: '7%' }}>Edit</th>
                    <th style={{ width: '7%' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => (
                    <tr key={product.productID}>
                    <td style={{ width: '3%' }}>{(currentPage - 1) * rowsPerPage + index + 1}</td> {/* Adjusted Serial Number */}
                    <td style={{ width: '40%' }}>{product.name}</td>
                    <td style={{ width: '4%' }}>{product.hsnHacCode}</td>
                    <td style={{ width: '10%' }}>{product.stock}</td>
                    <td style={{ width: '10%' }}>{product.gstPercentage}</td>
                    <td style={{ width: '10%' }}>
                      <strong>₹{product.sellPrice}</strong>
                    </td>
                    <td style={{ width: '10%' }}>
                      <strong>₹{product.purchasePrice}</strong>
                    </td>
                    <td style={{ width: '10%' }}>
                      <Button
                        className="button-no-outline"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                      >
                        <FontAwesomeIcon icon={faFileEdit} />
                      </Button>
                    </td>
                    <td style={{ width: '10%' }}>
                      <Button
                        className="button-no-outline"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.productID)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </Table>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="hsnHacCode">
                  <Form.Label>HSN/HAC Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="hsnHacCode"
                    value={newProduct.hsnHacCode}
                    onChange={handleChange}
                    isInvalid={!!errors.hsnHacCode}
                  />
                  <Form.Control.Feedback type="invalid">{errors.hsnHacCode}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="gstPercentage">
                  <Form.Label>GST Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="gstPercentage"
                    value={newProduct.gstPercentage}
                    onChange={handleChange}
                    isInvalid={!!errors.gstPercentage}
                  />
                  <Form.Control.Feedback type="invalid">{errors.gstPercentage}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="sellPrice">
                  <Form.Label>Sell Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellPrice"
                    value={newProduct.sellPrice}
                    onChange={handleChange}
                    isInvalid={!!errors.sellPrice}
                  />
                  <Form.Control.Feedback type="invalid">{errors.sellPrice}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="sellPriceIncludingTax">
                  <Form.Label>Sell Price Including Tax</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellPriceIncludingTax"
                    value={newProduct.sellPriceIncludingTax}
                    onChange={handleChange}
                    isInvalid={!!errors.sellPriceIncludingTax}
                  />
                  <Form.Control.Feedback type="invalid">{errors.sellPriceIncludingTax}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="purchasePrice">
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="purchasePrice"
                    value={newProduct.purchasePrice}
                    onChange={handleChange}
                    isInvalid={!!errors.purchasePrice}
                  />
                  <Form.Control.Feedback type="invalid">{errors.purchasePrice}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="purchasePriceIncludingTax">
                  <Form.Label>Purchase Price Including Tax</Form.Label>
                  <Form.Control
                    type="number"
                    name="purchasePriceIncludingTax"
                    value={newProduct.purchasePriceIncludingTax}
                    onChange={handleChange}
                    isInvalid={!!errors.purchasePriceIncludingTax}
                  />
                  <Form.Control.Feedback type="invalid">{errors.purchasePriceIncludingTax}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="productType">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="productType"
                    value={newProduct.productType}
                    onChange={handleChange}
                    isInvalid={!!errors.productType}
                  >
                    <option value="TAXABLE">Taxable</option>
                    <option value="NIL_RATED">Nil-Rated</option>
                    <option value="EXEMPT">Exempt</option>
                    <option value="NON_GST">Non-GST</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.productType}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cessAmount">
                  <Form.Label>CESS Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="cessAmount"
                    value={newProduct.cessAmount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="productDescription">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                name="productDescription"
                value={newProduct.productDescription}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="editName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editProduct?.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value } as Product)}
                    isInvalid={!!editErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editHsnHacCode">
                  <Form.Label>HSN/HAC Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="hsnHacCode"
                    value={editProduct?.hsnHacCode}
                    onChange={(e) => setEditProduct({ ...editProduct, hsnHacCode: e.target.value } as Product)}
                    isInvalid={!!editErrors.hsnHacCode}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.hsnHacCode}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="editGstPercentage">
                  <Form.Label>GST Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="gstPercentage"
                    value={editProduct?.gstPercentage}
                    onChange={(e) => setEditProduct({ ...editProduct, gstPercentage: parseFloat(e.target.value) } as Product)}
                    isInvalid={!!editErrors.gstPercentage}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.gstPercentage}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editStock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={editProduct?.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) } as Product)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="editSellPrice">
                  <Form.Label>Sell Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellPrice"
                    value={editProduct?.sellPrice}
                    onChange={(e) => setEditProduct({ ...editProduct, sellPrice: parseFloat(e.target.value) } as Product)}
                    isInvalid={!!editErrors.sellPrice}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.sellPrice}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editSellPriceIncludingTax">
                  <Form.Label>Sell Price Including Tax</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellPriceIncludingTax"
                    value={editProduct?.sellPriceIncludingTax}
                    onChange={(e) => setEditProduct({ ...editProduct, sellPriceIncludingTax: parseFloat(e.target.value) } as Product)}
                    isInvalid={!!editErrors.sellPriceIncludingTax}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.sellPriceIncludingTax}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="editPurchasePrice">
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="purchasePrice"
                    value={editProduct?.purchasePrice}
                    onChange={(e) => setEditProduct({ ...editProduct, purchasePrice: parseFloat(e.target.value) } as Product)}
                    isInvalid={!!editErrors.purchasePrice}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.purchasePrice}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editPurchasePriceIncludingTax">
                  <Form.Label>Purchase Price Including Tax</Form.Label>
                  <Form.Control
                    type="number"
                    name="purchasePriceIncludingTax"
                    value={editProduct?.purchasePriceIncludingTax}
                    onChange={(e) => setEditProduct({ ...editProduct, purchasePriceIncludingTax: parseFloat(e.target.value) } as Product)}
                    isInvalid={!!editErrors.purchasePriceIncludingTax}
                  />
                  <Form.Control.Feedback type="invalid">{editErrors.purchasePriceIncludingTax}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="editProductType">
                  <Form.Label>Product Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="productType"
                    value={editProduct?.productType}
                    onChange={(e) => setEditProduct({ ...editProduct, productType: e.target.value } as Product)}
                    isInvalid={!!editErrors.productType}
                  >
                    <option value="TAXABLE">Taxable</option>
                    <option value="NIL_RATED">Nil-Rated</option>
                    <option value="EXEMPT">Exempt</option>
                    <option value="NON_GST">Non-GST</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{editErrors.productType}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="editCessAmount">
                  <Form.Label>CESS Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="cessAmount"
                    value={editProduct?.cessAmount}
                    onChange={(e) => setEditProduct({ ...editProduct, cessAmount: parseFloat(e.target.value) } as Product)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="editProductDescription">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                name="productDescription"
                value={editProduct?.productDescription}
                onChange={(e) => setEditProduct({ ...editProduct, productDescription: e.target.value } as Product)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
