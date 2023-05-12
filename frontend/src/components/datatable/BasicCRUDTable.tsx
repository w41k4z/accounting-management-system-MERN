/* COMPONENT */
import { ReactNode, useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { BsDownload, BsUpload, BsFilter } from "react-icons/bs";
import { TableColumn } from "./TableColumn";
import { Modal } from "react-bootstrap";
import TableRow from "./TableRow";

interface BasicCRUDTableProps {
  title?: string;
  columns: TableColumn[];
  data: any[];
  dataPropIDName: string;
  indexedRow?: boolean;
  hasImportCsv?: boolean;
  hasExportPdf?: boolean;
  addModalForm: ReactNode;
  updateModalForm: (row: any) => ReactNode;
}

const BasicCRUDTable = ({
  title,
  columns,
  data,
  dataPropIDName,
  indexedRow = false,
  hasImportCsv = false,
  hasExportPdf = false,
  addModalForm,
  updateModalForm,
}: BasicCRUDTableProps) => {
  /* HOOOKS */
  const [filters, setFilters] = useState<{ [key: string]: string }>();
  useEffect(() => {
    const arrFilters: { [key: string]: string } = {};
    for (const column of columns) {
      arrFilters[column.propTarget] = "";
    }
    setFilters(arrFilters);
  }, [columns]);
  const [addModalVisibility, setAddModalVisibility] = useState(false);

  /* STYLES */
  const filterContainerStyle = {
    height: "30px",
    width: "fit-content",
    borderBottom: "1px outset",
    paddingBottom: "5px",
    display: "flex",
    alignItems: "center",
  };
  const filterStyle = {
    outline: "none",
    border: "unset",
  };

  /* LOGIC */
  const showAddModal = () => setAddModalVisibility(true);
  const hideAddModal = () => setAddModalVisibility(false);

  const filterData = () => {
    let filteredData = data;
    for (const column of columns) {
      filteredData = filteredData.filter((item) => {
        return item[column.propTarget]
          .toString()
          .toLowerCase()
          .includes(filters ? filters[column.propTarget].toLowerCase() : "");
      });
    }
    return filteredData;
  };
  const handleFilter = (filter: string, value: string) => {
    const arrFilter = { ...filters };
    arrFilter[filter] = value;
    setFilters({ ...arrFilter });
  };
  const clearFilter = (filter: string) => {
    const arrFilter = { ...filters };
    arrFilter[filter] = "";
    setFilters({ ...arrFilter });
  };

  /* ELEMENT */
  const addModal = (
    <Modal show onHide={hideAddModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add new {title && title.toLowerCase()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{addModalForm}</Modal.Body>
    </Modal>
  );

  return (
    <div className="m-4 bg-white">
      <div className="d-flex flex-column flex-md-row justify-content-md-between p-3">
        <h3>{title}</h3>
        <div
          className="d-flex align-items-center mt-sm-3 mt-md-0"
          style={{ height: "fit-content" }}
        >
          <div className="action d-flex">
            {hasImportCsv && (
              <button className="btn btn-outline-success d-flex align-items-center me-2">
                <BsUpload style={{ fontSize: "20px" }} className="me-2" />{" "}
                Import csv
              </button>
            )}
            {hasExportPdf && (
              <button className="btn btn-outline-dark d-flex align-items-center">
                <BsDownload style={{ fontSize: "20px" }} className="me-2" />{" "}
                Export pdf
              </button>
            )}
          </div>
          <button
            className="mx-1 btn btn-outline-primary"
            onClick={showAddModal}
          >
            <BiPlus style={{ fontSize: "20px" }} />
          </button>
          {addModalVisibility && addModal}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="px-2 table-bordered table-dark">
            <tr
              style={{
                color: "#000",
                fontSize: "1rem",
                fontWeight: "bold",
                borderBottom: "1px solid #959090",
              }}
              className="text-white"
            >
              {indexedRow && (
                <th scope="col">
                  <div>#.</div>
                </th>
              )}
              {columns.map((column, index) => {
                return (
                  <th scope="col" key={"table-header-" + index}>
                    <div>{column.name}</div>
                    <div style={filterContainerStyle}>
                      <BsFilter
                        className="me-1 d-none d-md-block"
                        style={{ fontSize: "23px" }}
                      />
                      <input
                        className="bg-dark text-white"
                        style={filterStyle}
                        placeholder={"Filter by '" + column.name + "'"}
                        type="text"
                        value={filters ? filters[column.propTarget] : ""}
                        onChange={(event) => {
                          handleFilter(column.propTarget, event.target.value);
                        }}
                      />
                      <AiOutlineClose
                        onClick={() => {
                          clearFilter(column.propTarget);
                        }}
                      />
                    </div>
                  </th>
                );
              })}
              <th scope="col">
                <div>Actions</div> <div style={{ height: "30px" }}></div>
              </th>
            </tr>
          </thead>
          <tbody className="px-2">
            {filterData().length === 0 && (
              <tr>
                {indexedRow && <td></td>}
                {columns.map((column, index) => {
                  return (
                    <td
                      key={"table-row-null-" + index}
                      style={{
                        fontStyle: "italic",
                      }}
                    >
                      null
                    </td>
                  );
                })}
                <td></td>
              </tr>
            )}
            {filterData().map((data, index) => (
              <TableRow
                key={"Table-row-" + index}
                columns={columns}
                data={data}
                dataPropIDName={dataPropIDName}
                indexedRow={indexedRow}
                index={index + 1}
                updateModalForm={updateModalForm(data)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicCRUDTable;
