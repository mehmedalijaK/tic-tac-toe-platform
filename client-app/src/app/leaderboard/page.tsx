"use client"
import AuthContext from "@/context/AuthContext"
import IUserRankDto from "@/model/IUserRankDto"
import { useContext, useEffect, useState } from "react"
import { getLeaderboard } from "@/api/auth/route"
import Typography from '@mui/material/Typography';
import { DataGrid } from "@mui/x-data-grid"

const Leaderboard = () => {

    const {token, user} = useContext(AuthContext)
    const [users, setUsers] = useState<IUserRankDto[] | null>([])

    useEffect(()=>{
        const fetchData = async () =>{
            //@ts-ignore
            const response = await getLeaderboard(token)

            if(response.ok){
                const ans = await response.json()
                console.log(ans)
                // Add an id field to each user object
                const usersWithId = ans.map((user: IUserRankDto, index: number) => ({
                    ...user,
                    id: index + 1 // You can change this logic to generate unique IDs
                }));
                setUsers(usersWithId)
                // setAppointmentsCount(ans.length)
            }
        }

        fetchData()
    },[token])


    const columns = [
        { field: "id", headerName: "Rank", flex: 1 },
        { field: "username", headerName: "Username", flex: 1 },
        { field: "score", headerName: "Score", flex: 1 },
    ];

    return(
        <>
            <div>
                <Typography variant="h5" className="mb-3 mt-7">Leaderboard</Typography>
                <DataGrid
                rows={users || []}
                columns={columns}
                rowCount={users?.length}
                pageSizeOptions={[5, 10, 25]}
                // getRowId={(row) => row.id} // Specify the custom ID field
                />

            </div>
        </>
    )
}

export default Leaderboard
