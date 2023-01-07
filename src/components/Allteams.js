import React, { useState, useEffect } from "react";
import "./Allteams.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/system/Box";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/system/Stack";
import { Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Grid";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#074684",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&": {
    backgroundColor: "#E3E7F1",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
export default function Allteams() {
  const [page, setPage] = useState(1);
  const [teamData, setTeamData] = useState([]);
  const [originalTeamData, setOriginalData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [teamById, setTeamById] = useState([]);
  const [teamByDate, setTeamByDate] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const drawerWidth = 400;
  const handleDrawerOpen = (id) => {
    setOpen(true);
    fetchDataByID(id);
    fetchDataByDate(id);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    await fetch(
      `https://www.balldontlie.io/api/v1/teams?page=${page}&per_page=8`
    )
      .then((res) => res.json())
      .then((data) => {
        setTeamData(data.data);
        setOriginalData(data.data);
        setPageNumber(data.meta.total_pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDataByID = async (id) => {
    await fetch(`https://www.balldontlie.io/api/v1/teams/${id}`)
      .then((res) => res.json())
      .then((data) => setTeamById(data))
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDataByDate = async (id) => {
    await fetch(
      `https://www.balldontlie.io/api/v1/games?seasons[]=2021&team_ids[]=${id}&dates[]=2021-10-04`
    )
      .then((res) => res.json())
      .then((data) => setTeamByDate(data.data))
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      setTeamData(originalTeamData);
      setTeamData(
        teamData.filter((team) =>
          team.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setTeamData(originalTeamData);
    }
  };

  return (
    <div>
      <Box sx={{ m: 5, fontFamily: "Roboto" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "#074684" }}
        >
          NBA TEAM
        </Typography>
        <FormControl sx={{ mb: 3, width: "55%" }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            color="primary"
            onChange={handleChange}
            focused
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <TableContainer>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Team Name</StyledTableCell>
                <StyledTableCell align="center">City</StyledTableCell>
                <StyledTableCell align="center">Abbrevation</StyledTableCell>
                <StyledTableCell align="center">Conference</StyledTableCell>
                <StyledTableCell align="center">Division</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamData.map((team) => (
                <StyledTableRow
                  key={team.id}
                  onClick={() => handleDrawerOpen(team.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <StyledTableCell component="th" scope="row" align="center">
                    {team.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{team.city}</StyledTableCell>
                  <StyledTableCell align="center">
                    {team.abbreviation}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {team.conference}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {team.division}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "flex-end", m: 3 }}
          >
            <Button
              sx={{ m: 1, backgroundColor: "#074684" }}
              variant="contained"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 ? true : false}
            >
              <ArrowBackIosIcon fontSize="small" />
            </Button>
            <Button
              sx={{ m: 1, backgroundColor: "#074684" }}
              variant="contained"
            >
              {page}
            </Button>
            <Button
              sx={{ m: 1, backgroundColor: "#074684" }}
              variant="contained"
            >
              {pageNumber}
            </Button>
            <Button
              sx={{ m: 1, backgroundColor: "#074684" }}
              variant="contained"
              onClick={() => setPage(page + 1)}
              disabled={page === pageNumber ? true : false}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Button>
          </Stack>
        </TableContainer>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <Stack sx={{ backgroundColor: "#F2F2F2" }}>
            <DrawerHeader sx={{ mb: 1.5 }}>
              <IconButton
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                onClick={handleDrawerClose}
              >
                <CancelIcon />
              </IconButton>
            </DrawerHeader>
            <Typography className="header">{teamById?.name}</Typography>
          </Stack>
          <Box sx={{ m: 3 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                Team Full Name
              </Grid>
              <Grid item xs={6}>
                {teamById.full_name}
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                Total Games in 2021
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                No Details found in APi
              </Grid>
            </Grid>
          </Box>
          <Typography sx={{ ml: 3, fontSize: "0.85em", fontWeight: "bold" }}>
            Random Game Details:
          </Typography>
          <Box sx={{ m: 3, fontWeight: "bold", fontSize: "0.88em" }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                Date
              </Grid>
              <Grid item xs={6}>
                {teamByDate[0]?.date.substring(0, 10).length
                  ? teamByDate[0]?.date.substring(0, 10)
                  : "No Data Found"}
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                Home Team
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                {teamByDate[0]?.home_team?.name.length
                  ? teamByDate[0]?.home_team?.name
                  : "No Data Found"}
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                Home Team Score
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                {teamByDate[0]?.home_team_score.toString().length
                  ? teamByDate[0]?.home_team_score
                  : "No Data Found"}
              </Grid>

              <Grid item xs={6} sx={{ mt: 3 }}>
                Visitor Team
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                {teamByDate[0]?.visitor_team?.name.length
                  ? teamByDate[0]?.visitor_team?.name
                  : "No Data Found"}
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                Visitor Team Score
              </Grid>
              <Grid item xs={6} sx={{ mt: 3 }}>
                {teamByDate[0]?.visitor_team_score.toString().length
                  ? teamByDate[0]?.visitor_team_score
                  : "No Data Found"}
              </Grid>
            </Grid>
          </Box>
        </Drawer>
      </Box>
    </div>
  );
}
