import React from "react";
import { Link } from "react-router-dom";

export function Categories(props) {
    const { categories } = props;
    if (!categories) {
        return "Loading Categories ...";
    } else {
        return (
            <ul className="dropdown-menu">
                {categories?.map((category) => {
                    return (
                        <li key={category._id}>
                            <Link
                                className="dropdown-item"
                                to={`productsByCategory/${category._id}`}
                            >
                                {category?.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    }
}
