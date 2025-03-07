import { useState, useEffect } from 'react';
import { Clear, Edit, LockReset, Logout, AccountBox, AccountCircle } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import Title from '@Components/Title';
import Table from '@Components/Table';
import Search from '@Components/Search';
import DeleteModal from '@Components/DeleteModal';
import Loading from '@Components/Loading';
import Menu, { OptionMenuType } from '@Components/Menu';
import Notification, { NotificationType } from '@Components/Notification';

import { listProducts, deleteProduct } from '@Api/services/products';

import { exportExcelProduct } from '@Utils/exportExcel';
import { Product } from '@Models/product';
import formatPrice from '@Utils/formatPrice';

import './style.sass';

const HomePage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [startPage, setStartPage] = useState<number>(0);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [loading, setLoading] = useState<boolean>(false);
  const [note, setNote] = useState<NotificationType>({
    message: "",
    show: false,
    type: "info"
  });

  const [results, setResults] = useState<Product[]>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [dataProduct, setDataProduct] = useState<Product[]>([]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate('/login');
}

  const setRangeList = (start : number, amount : number) => {
    let rangeList : Product[] = [];
    let dataBase = search && results ? results : dataProduct;

    if (start < dataBase.length && start >= 0) {
      for (var index = 0; index < amount; index++) {
        if (start + index < dataBase.length) {
          var product = dataBase[start + index];
          rangeList.push(product);
        }
      }
      setStartPage(start);
      setProductList(rangeList);
    }
  }

  async function delProduct(id : number) {
    setLoading(true);
    const deleteResponse = await deleteProduct(id);
    setOpenModal(false);

    if (deleteResponse.error) {
      setNote({
        show: true,
        message: `${deleteResponse.response.response.data.detail}`,
        type: "error"
      });
    } else {
      getAllProducts();
    }

    setLoading(false);
  }

  async function getAllProducts() {
    setLoading(true);
    const data = await listProducts();

    if (data.error) {
      if(data.response.response.status === 401) navigate("/login");

      setNote({
        show: true,
        message: `${data.response.response.data.detail}`,
        type: "error"
      });

    } else {
      setDataProduct(data[1]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if(!search) {
      setResults(dataProduct);
    } else {
      let searchResult : Product[] = dataProduct.filter((element) => 
        element.nome.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
        element.data_validade.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
        element.valor_compra.toString().indexOf(search.toLowerCase()) != -1 ||
        element.valor_venda.toString().indexOf(search.toLowerCase()) != -1 ||
        element.quantidade.toString().indexOf(search.toLowerCase()) != -1
      );
      setResults(searchResult);
    }
  }, [search]);

  useEffect(() => {
    setRangeList(0, 10);
  }, [results]);

  useEffect(() => {
    setProductList(dataProduct);
    setRangeList(0, 10);
  }, [dataProduct]);

  useEffect(() => {
    getAllProducts();
    
    if(localStorage.getItem("product-operation")) {
      setNote({
        show: true,
        message: `${localStorage.getItem("product-operation")}`,
        type: "success"
      });
      localStorage.removeItem("product-operation");
    }
  }, []);

  return (
    <div id="product-list-main" >
      <div id='product-list-header' >
        <Title
          title='Lista de produtos'
          subTitle='Veja a lista de produtos cadastrados no sistema'
        />
        <div id='product-list-header-content'>
          <Search
            placeholder='Pesquise por um produto'
            value={search}
            setValue={setSearch}
          />
          <Menu
            icon={<AccountCircle style={{ color: "#9A9494" }}/>}
            options={[
              { label: "Editar perfil", onPress: () => navigate("/profile-form"), icon: <AccountBox/> },
              { label: "Trocar senha", onPress: () => navigate("/change-password"), icon: <LockReset/> },
              { label: "Sair", onPress: () => logout(), icon: <Logout/> }
            ] as OptionMenuType[]}
            style={{
              margin: "0px 10px 0px 20px"
            }}
          />
        </div>
      </div>
      <Table
        onNextPage={() => setRangeList(startPage + 10, 10)}
        onReturnPage={() => setRangeList(startPage - 10, 10)}
        onExportData={() => exportExcelProduct(dataProduct, "Lista de Produtos")}
        columns={["Nome", "Validade", "Quantidade", "Valor", "% Ganho No Produto"]}
        title="Lista de produtos"
      >
        {
          productList.map((product, index) => (
            <ul key={index}>
              <li style={{ width: "100%", justifyContent: "left", paddingLeft: "20px" }}>{product.nome}</li>
              <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px' }}>{product.data_validade}</li>
              <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px' }}>{product.quantidade}</li>
              <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px' }}>{formatPrice(product.valor_compra)}</li>
              <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px'}}>{formatPrice(product.valor_venda)}</li>
              <li id="product-list-options" style={{ minWidth: "180px" }} >
                <Edit
                  onClick={() => {
                    navigate(`/product-form/${product.idProduto}`);
                  }}
                />
                <Clear 
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedProduct(product);
                  }} 
                />
              </li>
            </ul>
          ))
        }
      </Table>

      <DeleteModal
        description='Tem certeza que deseja deletar este item? Ao fazer isso todos os registros relacionados a ele serão deletados também!'
        title={`${selectedProduct?.nome}`}
        open={isOpenModal}
        setOpen={setOpenModal}
        onDelete={() => selectedProduct && selectedProduct.idProduto && delProduct(selectedProduct.idProduto)}
      />
      
      {
        loading && <Loading/>
      }
      <Notification 
        note={note}
        setNote={setNote}
      />
    </div>
  )
}

export default HomePage;
