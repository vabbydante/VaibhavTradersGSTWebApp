'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import '../../styles/globals.css';
import { Table, Button, Modal, Form, Alert, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSync, faFileEdit } from '@fortawesome/free-solid-svg-icons';
import { CircleLoader } from 'react-spinners';
import CustomPagination from '../../components/Pagination';

interface Customer {
    
}