import React, { FC } from "react";
import QsSearch from "../../utils/QsSearch";

/**
 * Returns a search box that controls the name query key value in the query
 * string component of the URL.
 *
 * @returns a search box that controls the name query key value in the query
 *   string component of the URL.
 */
const NameQsSearch: FC = () => <QsSearch qsKey="name" label="Name" />;

export default NameQsSearch;
