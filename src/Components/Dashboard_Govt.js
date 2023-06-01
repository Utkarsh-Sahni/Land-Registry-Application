import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { Button, Container, CircularProgress } from '@material-ui/core'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'
import Table from '../Containers/Govt_Table'
import { withStyles } from '@material-ui/core/styles'
import Web3 from 'web3'
import jwtDecode from 'jwt-decode'

const styles = (theme) => ({
  container: {
    // paddingLedt: '0px',
    // paddingRight: '0px',
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '100%',
    },
  },
})

async function fetchDataFromIPFS(hash) {
  const apiUrl = `https://ipfs.io/ipfs/${hash}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from IPFS');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetList: [],
      isLoading: true,
      username: '',
      Governmentpublickey: '',
      address: '',
      contact: '',
      city: '',
      imgurl: '',
    }
  }

  componentWillMount = async () => {
    // console.log('token= ' + window.localStorage.getItem('token'))
    const user = jwtDecode(window.localStorage.getItem('token'))
    this.setState({ ...user.user })
    // this.setState({ ...user.user })
    const web3 = window.web3
    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts()
    window.localStorage.setItem('web3account', accounts[0])
    this.setState({ isLoading: false })
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }
    this.getDetails()
  }

  async propertyDetails(property) {
    // console.log(property)
    let details = await this.state.landList.methods
      .landInfoOwner(property)
      .call()
      fetchDataFromIPFS(details[1]).then((res) => {

        //   })
        // ipfs.cat(details[1], (err, res) => {
          console.log("RESPONSE",res)
        
       
    
         {
            console.log("IM HERE")
            const obj = {
              property: property,
              uniqueID: details[1],
              name: res.name,
              key: details[0],
              email: res.email,
              contact: res.contact,
              pan: res.pan,
              occupation: res.occupation,
              oaddress: res.address,
              ostate: res.state,
              ocity: res.city,
              opostalCode: res.postalCode,
              laddress: res.laddress,
              lstate: res.lstate,
              lcity: res.lcity,
              lpostalCode: res.lpostalCode,
              larea: res.larea,
              lamount: details[2],
              isGovtApproved: details[3],
              isAvailable: details[4],
              requester: details[5],
              requestStatus: details[6],
              document: res.document,
              images: res.images,
            }
            this.setState({ assetList: [...this.state.assetList, obj] })
          }
        }).catch((err) => console.log(err))
  }

  async getDetails() {
    const properties = await this.state.landList.methods.Assets().call()
    // console.log(properties)

    for (let item of properties) {
      console.log('item:' + item)
      this.propertyDetails(item)
    }
  }
  render() {
    const { classes } = this.props
    return this.state.isLoading ? (
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <CircularProgress />
      </div>
    ) : (
      <div className="profile-bg">
        <div className={classes.container}>
          <Container style={{ marginTop: '40px' }}>
            {/* <Button
            style={{ marginTop: '30px' }}
            variant="contained"
            color="primary"
            onClick={() => this.props.history.push('/registration_form')}
          >
            Register Land
          </Button> */}
            <div style={{ marginTop: '100px' }}>
              <Table assetList={this.state.assetList} />
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(Dashboard)
