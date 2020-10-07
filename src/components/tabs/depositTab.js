import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers'
import React, {useState, useEffect} from 'react'
import {Row, Col, Card, CardTitle, Alert, CardText, Input, Button, Badge, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import { usePooledStakingETHContract } from '../../contracts/useContract';
function DepositTab() {
    const {account, library, chainId } = useWeb3React();

    const formatBN = (bn) => {
        return ethers.utils.commify(ethers.utils.formatEther(bn.toString()));
    }

    const [amountToDeposit, setAmountToDeposit] = useState(0);
    const [balanceSHEGIC, setBalanceSHEGIC] = useState(ethers.BigNumber.from('0'));
    const [statusMsg, setStatusMsg] = useState();
    const pooledStakingETH = usePooledStakingETHContract();
    
    useEffect(() => {
        if(!!account && !!library)
            pooledStakingETH.balanceOf(account).then((balance) => setBalanceSHEGIC(balance));
    }, [account, library, chainId, pooledStakingETH])

    const waitAndUpdate = async (txRequest) => {
        console.log(txRequest.hash)
        setStatusMsg("Pending "+txRequest.hash);
        await txRequest.wait();
        setStatusMsg("");
    }

    const depositHegic = async () => {
        const txRequest = await pooledStakingETH.deposit(amountToDeposit)
        await waitAndUpdate(txRequest)
    }

    const StatusMsg = () => {
        return (
            <>
            { statusMsg ? (
                <Alert color="primary">
                    {statusMsg}
                </Alert> 
            ) : null }
            </>
        );
    }

    return (
        <Row>
        <Col sm="12">
            <Card body>
                <CardTitle><h3>Stake $HEGIC</h3></CardTitle>

                <CardText>
                    <Badge color="primary">You have {formatBN(balanceSHEGIC)} sHEGIC</Badge>
                </CardText>

                <CardText>
                    Deposit your $HEGIC in the pool and start earning fees generated by the Hegic Protocol.<br />
                    1. Deposit your $HEGIC<br />
                    2. When deposited amount reaches the Staking Lot Price, the contract will buy a Hegic Staking Lot<br />
                    3. Earn fees and exit the pool when you want
                </CardText>
                <InputGroup>
                    <Input placeholder={ethers.utils.commify(amountToDeposit)} min={0} max={100} type="number" step="1" onChange={(event) => setAmountToDeposit(ethers.utils.parseEther(event.target.value))}/>
                    <InputGroupAddon addonType="append">
                    <InputGroupText>HEGIC</InputGroupText>
                    </InputGroupAddon>  
                </InputGroup>
                <Button style={{
                        marginTop:'10px',
                        color:'#15203d',
                        fontWeight:'bold',
                        fontFamily:'Jura',
                        letterSpacing:'.1em',
                        background:'transparent',
                        borderImageSource:'url(https://www.hegic.co/assets/img/button-primary.svg)', 
                        borderImageSlice:'20',
                        borderStyle:'solid',
                        boxSizing:'border-box',
                        borderRadius:'2px',
                        borderImageWidth:'50px'}} onClick={depositHegic}><b>DEPOSIT</b></Button>
                <StatusMsg />
            </Card>
        </Col>
      </Row>
    )
}

export default DepositTab;