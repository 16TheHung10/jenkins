import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

LinkToPage.propTypes = {};

function LinkToPage(props) {
  const {} = props;

  const [list, setList] = useState([]);

  const handleLinktoStoreManagement = () => {
    let token = localStorage.getItem("accessToken");
    let url = "https://store.gs25.com.vn/callback/switch?token=" + token;
    window.open(url, "_self");
  };

  useEffect(() => {}, []);

  const renderList = () => {
    return (
      <>
        {list.map((item) => (
          <>
            <li>
              <a
                href={void 0}
                onClick={handleLinktoStoreManagement}
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingTop: 11,
                }}
              >
                Store management
              </a>
            </li>
          </>
        ))}
      </>
    );
  };

  return renderList();
}

export default LinkToPage;
