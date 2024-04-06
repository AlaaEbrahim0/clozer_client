import axios from "axios";
import React, { useContext, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { cartContext } from "./CartContext";
import { wishlistContext } from "./WishlistContext";
import { API_BASE_URL } from "../config";
import { Slideshow } from "../SlideShow";

export function ProductDetails() {
    const token = localStorage.getItem("tkn");
    const { addProductToCart } = useContext(cartContext);
    const { addProductToWishlist } = useContext(wishlistContext);

    const { id } = useParams();
    const [counter, setCounter] = useState(1);

    async function addProduct(id, qty) {
        if (!token) {
            toast.error("Please log in to add product to cart");
            return;
        }
        const res = await addProductToCart(id, qty);
        console.log(res);
        if (res?.message === "Done") {
            toast.success("product was added to cart");
        }
    }

    async function wishProduct(id) {
        if (!token) {
            toast.error("Please log in to add product to wishlist");
            return;
        }
        const res = await addProductToWishlist(id);

        if (res.status === "success") {
            toast.success(res.message, {
                position: "top-right",
            });
        }
    }

    function getProductDetails() {
        return axios.get(`${API_BASE_URL}/product/${id}`);
    }
    const { data, isLoading } = useQuery("productDetails", getProductDetails);

    if (isLoading) {
        return (
            <div className=" vh-100 d-flex align-items-center justify-content-center">
                <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                        "#e15b64",
                        "#f47e60",
                        "#f8b26a",
                        "#abbd81",
                        "#849b87",
                    ]}
                />
            </div>
        );
    }

    // Increase counter
    const increaseCounter = () => {
        setCounter(counter + 1);
    };

    // Decrease counter
    const decreaseCounter = () => {
        if (counter > 1) {
            setCounter(counter - 1);
        }
    };

    return (
        <>
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <figure className="text-center">
                            {/* <img
                                className="img-fluid"
                                src={data.data.product.mainImage.secure_url}
                                alt={data.data.product.name}
                            />
                             */}
                            {Slideshow([
                                data.data.product.mainImage,
                                ...data.data.product.subImage,
                            ])}
                        </figure>
                    </div>
                    <div className="col-md-4" style={{ marginLeft: "40px" }}>
                        <div className="details">
                            <h1 className="mb-4">{data.data.product.name}</h1>
                            <p>Description: {data.data.product.description}</p>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                {data.data.product.discount ? (
                                    <p className="m-0 font-weight-bold">
                                        <span
                                            style={{
                                                textDecoration: "line-through",
                                            }}
                                        >
                                            {" "}
                                            {data.data.product.price} EGP
                                        </span>{" "}
                                        <span style={{ color: "red" }}>
                                            {data.data.product.discount}% OFF
                                        </span>{" "}
                                        {data.data.product.finalPrice} EGP
                                    </p>
                                ) : (
                                    <p className="m-0 fw-bold">
                                        {data.data.product.price} EGP
                                    </p>
                                )}
                                {/* Add ratings here */}
                            </div>
                            <div className="d-flex justify-content-start align-items-center mb-4">
                                <button
                                    onClick={decreaseCounter}
                                    className="btn btn-secondary rounded-circle mr-2"
                                >
                                    -
                                </button>
                                <span className="mx-2">{counter}</span>
                                <button
                                    onClick={increaseCounter}
                                    className="btn btn-secondary rounded-circle mr-2"
                                >
                                    +
                                </button>
                                <span className="mx-1"> </span>
                                <button
                                    onClick={() =>
                                        addProduct(
                                            data.data.product._id,
                                            counter
                                        )
                                    }
                                    className="btn btn-success ml-auto"
                                >
                                    Add to Cart
                                </button>
                                <span className="mx-1"> </span>

                                <span> </span>
                                <Link
                                    onMouseEnter={(e) =>
                                        e.target.classList.add("fa-solid")
                                    }
                                    onMouseLeave={(e) =>
                                        e.target.classList.remove("fa-solid")
                                    }
                                    onClick={() =>
                                        wishProduct(data.data.product._id)
                                    }
                                >
                                    <i className="pointer fa-regular fa-heart d-flex justify-content-end fs-3"></i>
                                </Link>
                            </div>

                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Available Colors:{" "}
                                </span>
                                {data.data.product.colors.join(", ")}
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Available Sizes:{" "}
                                </span>

                                {data.data.product.size.join(", ")}
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    Stock:{" "}
                                </span>
                                {data.data.product.stock}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
