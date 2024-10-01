"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchComponent from "@/app/Components/SearchComponent/SearchComponent";
import Button from "@/app/Components/Buttons/PrimaryButton/primaryButtons";
import AntTable from "@/app/Components/AntTable/Table";
import axios from "axios";
import { getCookie } from "@/helpers/cookies";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { findArtistName, getAddedTime } from "@/helpers/dataAction";
import MainPopUp from "@/app/Components/Pop-ups/MainPop-up/MainPop-up";

export interface ArtistInfo {
  id: number;
  firstName: string;
  lastName: string;
  biography: string;
  imageUrl: string;
  createdAt: string;
}

const Artist = () => {
  const [artistData, setArtistData] = useState<ArtistInfo[]>([]);
  const token = getCookie('token')
  const router = useRouter()
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)
  const [artistId, setArtistId] = useState<number>(0)
  const [editArtistId, setEditArtistId] = useState<number | null>(null)

  const getArtistsData = async () => {
    try {
      const response = await axios.get('https://merodibackend-2.onrender.com/author', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role == 'admin') {
          setArtistData(response.data)
        } else if (decodedToken.role == 'user') {
          alert(`You Are Not Admin`)
          return;
        }
      }
    }
    catch (err) {
    }
  }

  useEffect(() => {
    getArtistsData()
  }, [])

  const onAddArtistCLick = () => {
    router.push('/Artist/AddArtist')
  }

  const onEditClick = () => {
    router.push(`/Artist/AddArtist?id=${editArtistId}`)
  }

  useEffect(() => {
    if(editArtistId) {
      onEditClick()
    }
  }, [editArtistId])

  const onSubmitDeleteClick = (id: number) => {
    axios.delete(`https://merodibackend-2.onrender.com/author/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setShowDeletePopUp(false);
      alert(`Artist ${res.data.firstName} ${res.data.lastName} Deleted`)
      getArtistsData();
    })
    .catch((err) => {
      alert('Error');
    })
  }

  return (
    <>
      <div className={showDeletePopUp ? styles.popUpWrapper : styles.popUp}>
        <div className={showDeletePopUp ? styles.showPopUp : styles.hiddePopUp}>
          <MainPopUp id={artistId} title={"Delete Artist"} message={"Are you sure you want to delete"} target={findArtistName(artistId, artistData)} buttonTitle={"Delete"} onCancelClick={() => setShowDeletePopUp(false)} onSubmitClick={onSubmitDeleteClick}  />
        </div>
      </div>
      <main className={styles.container}>
        <div className={styles.headerBox}>
          <SearchComponent />
          <Button title={"Add Artist"} onClick={onAddArtistCLick} />
        </div>
        {artistData && <AntTable columns={[
          {
            title: "Artist Name",
            dataIndex: "artistName",
            width: 300
          },
          {
            title: "Biography",
            dataIndex: "biography",
            width: 432
          },
          {
            title: "Date added",
            dataIndex: "dateOfAdded",
          },
        ]}

          dataSource={
            artistData.map((item, index) => {
              return {
                key: index + 1,
                artistName: <div className={styles.artistBox}>
                  <Image className={styles.artistImage} src={item.imageUrl} alt="Artist Image" width={32} height={32} />
                  <span>{`${item.firstName} ${item.lastName}`}</span>
                </div>,
                biography: <div className={styles.biographyBox}>{item.biography}</div>,
                dateOfAdded: `${getAddedTime(item.createdAt)}`,
                edit: <Image src={"/icons/editIcon.svg"} alt="edit" width={24} height={24} onClick={() => setEditArtistId(item.id)} />,
                action: <Image onClick={() => {
                  setArtistId(item.id)
                  setShowDeletePopUp(true)
                }} src={"/icons/trash.svg"} alt="block" width={24} height={24} />
              }
            })
          }
        />}
      </main>
    </>
  );
};

export default Artist;
