import React, { FC } from "react";
import QsSearch from "../../utils/QsSearch";

/**
 * Returns a search box that controls the creatorId query key value in the
 * query string component of the URL.
 *
 * @returns a search box that controls the creatorId query key value in the
 *   query string component of the URL.
 */
const CreatorQsSeach: FC = () => <QsSearch qsKey="creatorId" label="Creator" />;

export default CreatorQsSeach;
